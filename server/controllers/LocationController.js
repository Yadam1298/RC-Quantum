const Attendance = require('../models/Attendance');
const LocationLog = require('../models/LocationLog');

exports.addLocationLogs = async (req, res) => {
  try {
    const { attendanceId, logs } = req.body;

    if (!attendanceId || !logs || !Array.isArray(logs) || logs.length === 0) {
      return res
        .status(400)
        .json({ message: 'attendanceId and logs array are required' });
    }

    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    if (!req.employee) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (attendance.employee.toString() !== req.employee._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Unauthorized to update this attendance' });
    }

    const locationDocs = logs.map((log) => ({
      attendance: attendanceId,
      timestamp: log.timestamp ? new Date(log.timestamp) : new Date(),
      lat: log.lat,
      lng: log.lng,
      accuracy: log.accuracy || 0,
      address: log.address || '',
    }));

    await LocationLog.insertMany(locationDocs);

    const latestTimestamp = locationDocs.reduce(
      (max, doc) => (doc.timestamp > max ? doc.timestamp : max),
      new Date(0),
    );

    attendance.lastLocationUpdate = latestTimestamp;
    await attendance.save();

    res.status(201).json({
      message: `Stored ${locationDocs.length} location logs`,
      lastLocationUpdate: latestTimestamp,
    });
  } catch (error) {
    console.error('Error adding location logs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};