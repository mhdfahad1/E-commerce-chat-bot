const Message = require('../models/Message');
const Session = require('../models/Session');

/**
 * Retrieve high-level analytics from MongoDB.
 * @returns {Promise<{ totalMessages: number, totalSessions: number }>}
 */
async function getAnalytics() {
    const [totalMessages, totalSessions] = await Promise.all([
        Message.countDocuments(),
        Session.countDocuments(),
    ]);

    return { totalMessages, totalSessions };
}

module.exports = { getAnalytics };
