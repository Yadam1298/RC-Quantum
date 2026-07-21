const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const mongoose = require('mongoose');

// ---------- Helper: resolve employee _id from empID or ObjectId ----------
const resolveEmployeeId = async (identifier) => {
  if (!identifier) return null;

  // Check if it's a valid ObjectId
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const employee = await Employee.findById(identifier).select('_id');
    if (employee) return employee._id;
  }

  // Otherwise, treat as empID (case-insensitive)
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
      // NEW: include method and location of the check-in (and optionally check-out)
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
// 1. Mark attendance (public endpoint)
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
      // ---------- First punch of the day – always 'in' ----------
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
        lastLocationUpdate: now, // start tracking
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

    // ---------- Existing attendance – determine next type ----------
    const lastPunch = attendance.punches[attendance.punches.length - 1];
    const nextType = lastPunch.type === 'in' ? 'out' : 'in';

    const newPunch = {
      type: nextType,
      timestamp: now,
      method: method,
      location: location,
    };

    attendance.punches.push(newPunch);

    // Update lastLocationUpdate based on punch type
    if (nextType === 'in') {
      attendance.lastLocationUpdate = now;
    } else {
      attendance.lastLocationUpdate = null; // stop tracking on checkout
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
// 1. Mark attendance on mobile (authenticated)
// ------------------------------------------------------------------
exports.markAttendanceMobile = async (req, res) => {
  try {
    console.log('req.employee:', req.employee); // for debugging

    const { type, lat, lng, address } = req.body;

    if (!type || !['in', 'out'].includes(type)) {
      return res
        .status(400)
        .json({ message: 'Valid type (in/out) is required' });
    }

    // Get employee ID from req.employee
    if (!req.employee) {
      console.error('Employee not found in req.employee');
      return res
        .status(401)
        .json({ message: 'Employee not authenticated properly' });
    }

    const employeeId = req.employee._id;

    // Optional: verify employee exists (already done by middleware)
    // but we can keep it safe
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const now = new Date();
    const date = getStartOfDay(now);

    let attendance = await Attendance.findOne({ employee: employeeId, date });

    if (!attendance) {
      // First punch of the day – must be 'in'
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

    // Existing attendance – determine next type
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
// 2. Get all attendance logs (admin/superadmin)
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
      punches: doc.punches, // now includes method & location
      pairs: computePairs(doc.punches), // now includes method & location in pairs
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
// 3. Get attendance for a specific employee and date
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

    // Resolve the employee _id
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
      punches: attendance.punches, // includes method & location
      pairs, // includes method & location
      totalMinutes: pairs.reduce((sum, p) => sum + (p.duration || 0), 0),
    });
  } catch (error) {
    console.error('Error fetching employee attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ------------------------------------------------------------------
// 4. Get calendar overview for an employee
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

    // Resolve employee _id
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
// Dashboard Summary
// ------------------------------------------------------------------
exports.getAttendanceDashboard = async (req, res) => {
  try {
    const today = getStartOfDay(new Date());
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    // Total Employees
    const totalEmployees = await Employee.countDocuments();

    // Today's Attendance
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

      // Office starts at 9:15 AM
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
        // Optionally add method & location of first/last punch if needed
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
