const cron = require('node-cron');
const Attendance = require('../models/Attendance');
const LocationLog = require('../models/LocationLog');

const AUTO_CHECKOUT_MINUTES = 3; // configurable via env

const autoCheckout = async () => {
  try {
    const now = new Date();
    const cutoff = new Date(now.getTime() - AUTO_CHECKOUT_MINUTES * 60 * 1000);

    // Find active attendances (last punch is 'in') using aggregation
    const activeDocs = await Attendance.aggregate([
      { $addFields: { lastPunch: { $arrayElemAt: ['$punches', -1] } } },
      { $match: { 'lastPunch.type': 'in' } },
      { $project: { _id: 1, employee: 1, date: 1, lastLocationUpdate: 1 } },
    ]);

    for (const aggDoc of activeDocs) {
      // Check if lastLocationUpdate is missing or older than cutoff
      if (!aggDoc.lastLocationUpdate || aggDoc.lastLocationUpdate < cutoff) {
        // Retrieve the actual Attendance document
        const doc = await Attendance.findById(aggDoc._id);
        if (!doc) continue; // just in case

        // Double-check that the last punch is still 'in' (avoid race condition)
        const lastPunch = doc.punches[doc.punches.length - 1];
        if (!lastPunch || lastPunch.type !== 'in') continue;

        // Fetch the most recent location log (optional)
        const lastLocationLog = await LocationLog.findOne(
          { attendance: doc._id },
          { lat: 1, lng: 1, address: 1 },
          { sort: { timestamp: -1 } },
        );

        const autoPunch = {
          type: 'out',
          timestamp: aggDoc.lastLocationUpdate || now, // use last known time or now
          method: 'Auto',
          location: lastLocationLog
            ? {
                lat: lastLocationLog.lat,
                lng: lastLocationLog.lng,
                address: lastLocationLog.address,
              }
            : null,
        };

        doc.punches.push(autoPunch);
        doc.lastLocationUpdate = null; // stop tracking

        await doc.save();
        console.log(
          `✅ Auto checked out employee ${doc.employee} for date ${doc.date}`,
        );
      }
    }
  } catch (error) {
    console.error('❌ Auto checkout job error:', error);
  }
};

// Schedule to run every minute
cron.schedule('* * * * *', autoCheckout);

module.exports = autoCheckout;
