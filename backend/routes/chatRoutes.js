const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Session = require('../models/Session');
const { generateReply } = require('../services/aiService');

/* POST /api/chat
* Accepts { message, sessionId } and returns { reply }.
*/
router.post('/', async (req, res, next) => {
    try {
        const { message, sessionId } = req.body;

        // ── Input validation
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({
                error: 'Message is required and must be a non-empty string.',
            });
        }

        if (!sessionId || typeof sessionId !== 'string') {
            return res.status(400).json({
                error: 'sessionId is required and must be a string.',
            });
        }

        const trimmedMessage = message.trim();

        // ── Upsert session
        await Session.findOneAndUpdate(
            { sessionId },
            { sessionId, startedAt: new Date() },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // ── Save user message
        await Message.create({
            sessionId,
            message: trimmedMessage,
            role: 'user',
        });

        // ── Generate bot reply (includes simulated delay)
        const reply = await generateReply(trimmedMessage);

        // ── Save bot message
        await Message.create({
            sessionId,
            message: reply,
            role: 'bot',
        });

        return res.json({ reply });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
