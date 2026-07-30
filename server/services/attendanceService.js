const Attendance = require('../models/Attendance');
const LocationLog = require('../models/LocationLog');

/**
 * If the employee currently has an open attendance session (their most
 * recent punch is 'in'), force a matching 'out' punch onto it.
 *
 * Called from authController.loginEmployee, before a new token is issued,
 * so that logging in on a second device can never leave a session dangling
 * open on the first device - this works even if the first device is
 * completely offline, because it only ever touches the database, never the
 * other device.
 */
async function forceCheckoutActiveSession(employeeId, reason) {
  const attendance = await Attendance.findOne({ employee: employeeId }).sort({
    date: -1,
  });

  if (!attendance || attendance.punches.length === 0) return null;

  const lastPunch = attendance.punches[attendance.punches.length - 1];
  if (lastPunch.type !== 'in') return null; // already checked out, nothing to do

  // Best-effort: use the last known GPS fix for this session as the
  // checkout location, since the device that opened it may be unreachable.
  let location = lastPunch.location || {};
  try {
    const lastLog = await LocationLog.findOne({ attendance: attendance._id }).sort({
      timestamp: -1,
    });
    if (lastLog) {
      location = { lat: lastLog.lat, lng: lastLog.lng, address: lastLog.address || '' };
    }
  } catch (_) {
    // Non-fatal - fall back to the check-in location captured above.
  }

  attendance.punches.push({
    type: 'out',
    timestamp: new Date(),
    method: 'Auto',
    location,
    autoCheckout: true,
    reason: reason || 'Force checkout',
  });
  attendance.lastLocationUpdate = null;

  await attendance.save();
  return attendance;
}

module.exports = { forceCheckoutActiveSession };