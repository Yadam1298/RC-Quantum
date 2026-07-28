const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const mongoose = require('mongoose');
const LocationLog = require('../models/LocationLog');

// ---------- Helper: resolve employee _id from empID or ObjectId ----------
const resolveEmployeeId = async (identifier) => {
  if (!identifier) return null;

  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const employee = await Employee.findById(identifier).select('_id');
    if (employee) return employee._id;
  }

  const employee = await Employee.findOne({
    empID: identifier.toUpperCase(),
  }).select('_id');
  return employee ? employee._id : null;
};

// ---------- Helper: get start‑of‑day Date (UTC) ----------
const getStartOfDay = (date) => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

// ---------- Helper: compute (in, out) pairs ----------
const computePairs = (punches) => {
  const pairs = [];
  let i = 0;
  while (i < punches.length) {
    const inPunch = punches[i];
    if (inPunch.type !== 'in') {
      i++;
      continue;
    }
    const outPunch =
      punches[i + 1] && punches[i + 1].type === 'out' ? punches[i + 1] : null;
    pairs.push({
      checkIn: inPunch.timestamp,
      checkOut: outPunch ? outPunch.timestamp : null,
      duration: outPunch
        ? (outPunch.timestamp - inPunch.timestamp) / (1000 * 60)
        : null,
      checkInMethod: inPunch.method,
      checkInLocation: inPunch.location,
      checkOutMethod: outPunch ? outPunch.method : null,
      checkOutLocation: outPunch ? outPunch.location : null,
    });
    i += outPunch ? 2 : 1;
  }
  return pairs;
};

// ------------------------------------------------------------------
// 1. Mark attendance (public endpoint for RFID)
// ------------------------------------------------------------------
exports.markAttendance = async (req, res) => {
  try {
    const { cardUID, timestamp, method = 'RFID', location = null } = req.body;

    if (!cardUID) {
      return res.status(400).json({ message: 'cardUID is required' });
    }

    const employee = await Employee.findOne({ cardUID });
    if (!employee) {
      return res
        .status(404)
        .json({ message: 'Employee not found for this card UID' });
    }

    const now = timestamp ? new Date(timestamp) : new Date();
    const date = getStartOfDay(now);

    let attendance = await Attendance.findOne({ employee: employee._id, date });

    if (!attendance) {
      const newPunch = {
        type: 'in',
        timestamp: now,
        method: method,
        location: location,
      };

      attendance = new Attendance({
        employee: employee._id,
        date,
        punches: [newPunch],
        lastLocationUpdate: now,
      });

      await attendance.save();

      return res.status(201).json({
        message: 'Check‑in recorded',
        type: 'in',
        timestamp: now,
        method: method,
        location: location,
        employee: employee.empID,
      });
    }

    const lastPunch = attendance.punches[attendance.punches.length - 1];
    const nextType = lastPunch.type === 'in' ? 'out' : 'in';

    const newPunch = {
      type: nextType,
      timestamp: now,
      method: method,
      location: location,
    };

    attendance.punches.push(newPunch);

    if (nextType === 'in') {
      attendance.lastLocationUpdate = now;
    } else {
      attendance.lastLocationUpdate = null;
    }

    await attendance.save();

    res.status(200).json({
      message: `Check‑${nextType === 'in' ? 'in' : 'out'} recorded`,
      type: nextType,
      timestamp: now,
      method: method,
      location: location,
      employee: employee.empID,
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ------------------------------------------------------------------
// 2. Mark attendance on mobile (authenticated)
// ------------------------------------------------------------------
exports.markAttendanceMobile = async (req, res) => {
  try {
    const { type, lat, lng, address, autoCheckout = false, reason = '' } = req.body;

    if (!type || !['in', 'out'].includes(type)) {
      return res
        .status(400)
        .json({ message: 'Valid type (in/out) is required' });
    }

    if (!req.employee) {
      console.error('Employee not found in req.employee');
      return res
        .status(401)
        .json({ message: 'Employee not authenticated properly' });
    }

    const employeeId = req.employee._id;
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const now = new Date();
    const date = getStartOfDay(now);

    let attendance = await Attendance.findOne({ employee: employeeId, date });

    if (!attendance) {
      if (type !== 'in') {
        return res
          .status(400)
          .json({ message: 'First punch of the day must be check-in' });
      }
      const newPunch = {
        type: 'in',
        timestamp: now,
        method: 'App',
        location: { lat, lng, address: address || '' },
      };
      attendance = new Attendance({
        employee: employeeId,
        date,
        punches: [newPunch],
        lastLocationUpdate: now,
      });
      await attendance.save();
      return res.status(201).json({
        message: 'Check-in recorded',
        type: 'in',
        timestamp: now,
        employee: employeeId,
        _id: attendance._id,
      });
    }

    const lastPunch = attendance.punches[attendance.punches.length - 1];
    const expectedType = lastPunch.type === 'in' ? 'out' : 'in';
    if (type !== expectedType) {
      return res.status(400).json({
        message: `Expected ${expectedType}, but got ${type}. Check-in/out must alternate.`,
      });
    }

    const newPunch = {
      type: type,
      timestamp: now,
      method: 'App',
      location: { lat, lng, address: address || '' },
      autoCheckout: autoCheckout,
      reason: reason,
    };
    attendance.punches.push(newPunch);

    if (type === 'in') {
      attendance.lastLocationUpdate = now;
    } else {
      attendance.lastLocationUpdate = null;
    }

    await attendance.save();

    res.status(200).json({
      message: `Check-${type} recorded`,
      type: type,
      timestamp: now,
      employee: employeeId,
      _id: attendance._id,
    });
  } catch (error) {
    console.error('Error marking mobile attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ------------------------------------------------------------------
// 3. Get all attendance logs (admin/superadmin)
// ------------------------------------------------------------------
exports.getAttendanceLogs = async (req, res) => {
  try {
    const { employeeId, startDate, endDate, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (employeeId) {
      const empObjectId = await resolveEmployeeId(employeeId);
      if (!empObjectId) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      filter.employee = empObjectId;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = getStartOfDay(new Date(startDate));
      if (endDate) filter.date.$lte = getStartOfDay(new Date(endDate));
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [attendance, total] = await Promise.all([
      Attendance.find(filter)
        .populate('employee', 'empID name email phone designation profileImage')
        .sort({ date: -1, 'punches.timestamp': -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Attendance.countDocuments(filter),
    ]);

    const logs = attendance.map((doc) => ({
      _id: doc._id,
      employee: doc.employee,
      date: doc.date,
      punches: doc.punches,
      pairs: computePairs(doc.punches),
      totalMinutes: computePairs(doc.punches).reduce(
        (sum, p) => sum + (p.duration || 0),
        0,
      ),
    }));

    res.json({
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching attendance logs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ------------------------------------------------------------------
// 4. Get attendance for a specific employee and date
// ------------------------------------------------------------------
exports.getEmployeeAttendanceByDate = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res
        .status(400)
        .json({ message: 'Date query parameter is required (YYYY-MM-DD)' });
    }

    const empObjectId = await resolveEmployeeId(employeeId);
    if (!empObjectId) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const start = getStartOfDay(new Date(date));
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);

    const attendance = await Attendance.findOne({
      employee: empObjectId,
      date: { $gte: start, $lt: end },
    }).populate('employee', 'empID name email phone designation profileImage');

    if (!attendance) {
      return res.status(404).json({
        message: 'No attendance found for this employee on this date',
      });
    }

    const pairs = computePairs(attendance.punches);
    res.json({
      employee: attendance.employee,
      date: attendance.date,
      punches: attendance.punches,
      pairs,
      totalMinutes: pairs.reduce((sum, p) => sum + (p.duration || 0), 0),
    });
  } catch (error) {
    console.error('Error fetching employee attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ------------------------------------------------------------------
// 5. Get calendar overview for an employee
// ------------------------------------------------------------------
exports.getEmployeeAttendanceDates = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { year, month } = req.query;

    if (!year || !month) {
      return res
        .status(400)
        .json({ message: 'year and month query parameters are required' });
    }

    const empObjectId = await resolveEmployeeId(employeeId);
    if (!empObjectId) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const attendances = await Attendance.find({
      employee: empObjectId,
      date: { $gte: start, $lt: end },
    })
      .select('date punches')
      .lean();

    const calendarData = attendances.map((doc) => {
      const pairs = computePairs(doc.punches);
      const totalMinutes = pairs.reduce((sum, p) => sum + (p.duration || 0), 0);
      return {
        date: doc.date,
        totalMinutes,
        punchCount: doc.punches.length,
      };
    });

    res.json(calendarData);
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ------------------------------------------------------------------
// 6. Dashboard Summary
// ------------------------------------------------------------------
exports.getAttendanceDashboard = async (req, res) => {
  try {
    const today = getStartOfDay(new Date());
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    const totalEmployees = await Employee.countDocuments();

    const todayAttendance = await Attendance.find({
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    }).populate('employee', 'empID name designation profileImage');

    let present = 0;
    let absent = 0;
    let late = 0;
    let workingNow = 0;
    let checkedOut = 0;

    let totalMinutesWorked = 0;
    let completedEmployees = 0;
    let totalPunches = 0;

    const employeeLogs = [];

    for (const attendance of todayAttendance) {
      const punches = attendance.punches || [];

      totalPunches += punches.length;

      const pairs = computePairs(punches);

      const workedMinutes = pairs.reduce(
        (sum, pair) => sum + (pair.duration || 0),
        0,
      );

      if (workedMinutes > 0) {
        totalMinutesWorked += workedMinutes;
        completedEmployees++;
      }

      const firstPunch = punches[0];

      let status = 'Present';

      if (firstPunch) {
        const hour = firstPunch.timestamp.getHours();
        const minute = firstPunch.timestamp.getMinutes();

        if (hour > 9 || (hour === 9 && minute > 15)) {
          late++;
          status = 'Late';
        }
      }

      const lastPunch = punches[punches.length - 1];

      if (lastPunch?.type === 'in') {
        workingNow++;
      } else {
        checkedOut++;
      }

      present++;

      employeeLogs.push({
        employee: attendance.employee,
        status,
        checkIn: punches.find((p) => p.type === 'in')?.timestamp || null,
        checkOut:
          [...punches].reverse().find((p) => p.type === 'out')?.timestamp ||
          null,
        workingMinutes: workedMinutes,
      });
    }

    absent = totalEmployees - present;

    const attendanceRate =
      totalEmployees === 0
        ? 0
        : Number(((present / totalEmployees) * 100).toFixed(2));

    const averageWorkingHours =
      completedEmployees === 0
        ? 0
        : Number((totalMinutesWorked / completedEmployees / 60).toFixed(2));

    res.json({
      summary: {
        totalEmployees,
        present,
        absent,
        late,
        workingNow,
        checkedOut,
        attendanceRate,
        averageWorkingHours,
        totalPunches,
      },
      employees: employeeLogs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Failed to fetch dashboard',
      error: error.message,
    });
  }
};

// ------------------------------------------------------------------
// 7. Get location history for an employee (admin/superadmin)
// ------------------------------------------------------------------
exports.getEmployeeLocationHistory = async (req, res) => {
  try {
    const { employeeId, startDate, endDate, page = 1, limit = 50 } = req.query;

    if (!employeeId) {
      return res.status(400).json({ message: 'employeeId is required' });
    }

    const empObjectId = await resolveEmployeeId(employeeId);
    if (!empObjectId) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (req.employee.role !== 'admin' && req.employee.role !== 'superadmin') {
      if (req.employee._id.toString() !== empObjectId.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const dateFilter = {};
    if (startDate) {
      dateFilter.$gte = getStartOfDay(new Date(startDate));
    }
    if (endDate) {
      dateFilter.$lte = getStartOfDay(new Date(endDate));
    }

    const attendanceFilter = { employee: empObjectId };
    if (startDate || endDate) {
      attendanceFilter.date = dateFilter;
    }

    const attendances = await Attendance.find(attendanceFilter)
      .select('_id')
      .lean();

    const attendanceIds = attendances.map(a => a._id);

    if (attendanceIds.length === 0) {
      return res.json({ logs: [], total: 0, pagination: { total: 0, page: parseInt(page), limit: parseInt(limit), pages: 0 } });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const filter = { attendance: { $in: attendanceIds } };

    const [logs, total] = await Promise.all([
      LocationLog.find(filter)
        .populate({
          path: 'attendance',
          populate: { path: 'employee', select: 'empID name designation profileImage' }
        })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      LocationLog.countDocuments(filter),
    ]);

    res.json({
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching location history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ------------------------------------------------------------------
// 8. Get live location (most recent) for an employee
// ------------------------------------------------------------------
exports.getEmployeeLiveLocation = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) {
      return res.status(400).json({ message: 'employeeId is required' });
    }

    const empObjectId = await resolveEmployeeId(employeeId);
    if (!empObjectId) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (req.employee.role !== 'admin' && req.employee.role !== 'superadmin') {
      if (req.employee._id.toString() !== empObjectId.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const latestLog = await LocationLog.findOne()
      .populate({
        path: 'attendance',
        match: { employee: empObjectId },
        populate: { path: 'employee', select: 'empID name designation profileImage' }
      })
      .sort({ timestamp: -1 })
      .lean();

    if (!latestLog || !latestLog.attendance) {
      return res.status(404).json({ message: 'No location data found for this employee' });
    }

    res.json(latestLog);
  } catch (error) {
    console.error('Error fetching live location:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ------------------------------------------------------------------
// 9. Get location logs for a specific attendance record
// ------------------------------------------------------------------
exports.getLocationLogsByAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(attendanceId)) {
      return res.status(400).json({ message: 'Invalid attendance ID' });
    }

    const attendance = await Attendance.findById(attendanceId)
      .populate('employee', 'empID name designation profileImage');
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    if (req.employee.role !== 'admin' && req.employee.role !== 'superadmin') {
      if (req.employee._id.toString() !== attendance.employee._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const logs = await LocationLog.find({ attendance: attendanceId })
      .sort({ timestamp: 1 })
      .lean();

    res.json({
      attendance,
      logs,
    });
  } catch (error) {
    console.error('Error fetching location logs for attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ------------------------------------------------------------------
// 10. Get location logs by time range for an employee session
// ------------------------------------------------------------------
exports.getLocationLogsByTimeRange = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startTime, endTime } = req.query;

    if (!employeeId || !startTime || !endTime) {
      return res.status(400).json({ 
        message: 'employeeId, startTime, and endTime are required' 
      });
    }

    const empObjectId = await resolveEmployeeId(employeeId);
    if (!empObjectId) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Authorization check matching your other routes
    if (req.employee && req.employee.role !== 'admin' && req.employee.role !== 'superadmin') {
      if (req.employee._id.toString() !== empObjectId.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    // Find attendance records belonging to this employee that overlap with the time range
    const attendances = await Attendance.find({
      employee: empObjectId,
    }).select('_id date').lean();

    const attendanceIds = attendances.map(a => a._id);

    if (attendanceIds.length === 0) {
      return res.json({ logs: [] });
    }

    // Query LocationLogs tied to the employee's attendance records within exact timestamps
    const logs = await LocationLog.find({
      attendance: { $in: attendanceIds },
      timestamp: {
        $gte: new Date(startTime),
        $lte: new Date(endTime),
      },
    })
      .sort({ timestamp: 1 })
      .lean();

    res.json({ logs });
  } catch (error) {
    console.error('Error fetching logs by time range:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};