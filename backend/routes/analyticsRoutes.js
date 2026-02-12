const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../services/analyticsService');

/* GET /api/analytics
* Returns { totalMessages, totalSessions }.
*/
router.get('/', async (req, res, next) => {
    try {
        const analytics = await getAnalytics();
        return res.json(analytics);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
