/**
 * Rule-based AI response service.
 * Matches user messages against keyword categories and returns
 * a relevant mock response. Simulates LLM latency with a random
 * 500–1500 ms delay.
 */

// ── Keyword → response rules ──────────────────────────────────────

const PRODUCT_KEYWORDS = {
    shoes: [
        'Here are some popular shoes you might like:\n• Nike Air Max 270 – ₹8,995\n• Adidas Ultraboost – ₹12,999\n• Puma RS-X – ₹6,499',
        'Check out our trending shoes:\n• Reebok Classic – ₹5,499\n• New Balance 574 – ₹7,999\n• Skechers Go Walk – ₹4,299',
    ],
    shirts: [
        'Here are some shirt recommendations:\n• Levi\'s Casual Shirt – ₹1,799\n• Allen Solly Formal Shirt – ₹1,499\n• H&M Slim Fit Shirt – ₹999',
        'Popular shirts right now:\n• Peter England Cotton Shirt – ₹1,299\n• Zara Oversized Shirt – ₹2,490\n• Uniqlo Oxford Shirt – ₹1,990',
    ],
    bags: [
        'Top bag picks for you:\n• Wildcraft Backpack – ₹1,499\n• American Tourister Laptop Bag – ₹2,199\n• Hidesign Leather Tote – ₹4,995',
        'Trending bags:\n• Skybags Casual Backpack – ₹999\n• Lavie Women\'s Handbag – ₹1,799\n• Safari Duffel Bag – ₹1,299',
    ],
    jeans: [
        'Great jeans options:\n• Levi\'s 511 Slim Fit – ₹2,799\n• Wrangler Bootcut – ₹2,199\n• Pepe Jeans Skinny – ₹1,999',
    ],
    watches: [
        'Popular watches:\n• Fastrack Analog – ₹1,495\n• Titan Classique – ₹3,995\n• Casio G-Shock – ₹7,995',
    ],
    electronics: [
        'Trending electronics:\n• boAt Airdopes 141 – ₹1,299\n• Fire-Boltt Smartwatch – ₹1,499\n• JBL Flip 5 Speaker – ₹8,999',
    ],
};

const PRICE_RESPONSES = [
    'We have a wide range of products across all price points. Could you tell me which category you\'re interested in? (e.g., shoes, shirts, bags)',
    'Our products range from ₹499 to ₹15,000. Let me know your budget and preferred category so I can find the best options for you!',
];

const GREETING_KEYWORDS = ['hi', 'hello', 'hey', 'good morning', 'good evening', 'howdy'];
const GREETING_RESPONSES = [
    'Hello! 👋 Welcome to our store. How can I help you today?',
    'Hey there! 😊 Looking for something specific? I can help you find products, check prices, or answer questions.',
    'Hi! Welcome! Feel free to ask me about our products — shoes, shirts, bags, and more!',
];

const HELP_KEYWORDS = ['help', 'support', 'assist', 'what can you do'];
const HELP_RESPONSE =
    'I can help you with:\n• 🛍️ Product recommendations (shoes, shirts, bags, etc.)\n• 💰 Pricing information\n• 📦 Order-related queries\n• ❓ General store questions\n\nJust type your question and I\'ll do my best!';

const ORDER_KEYWORDS = ['order', 'delivery', 'shipping', 'track', 'return', 'refund'];
const ORDER_RESPONSE =
    'For order-related queries:\n• 📦 Standard delivery takes 5–7 business days\n• 🚀 Express delivery available for ₹99 extra\n• 🔄 Easy 30-day returns on most items\n• 💳 Refunds processed within 5–7 business days\n\nNeed help with a specific order? Please share your order ID.';

const FALLBACK_RESPONSES = [
    'I\'m not sure I understand that. Could you rephrase? You can ask me about products, prices, or orders!',
    'Hmm, I didn\'t catch that. Try asking about a specific product like "Show me shoes" or "Bags under 2000".',
    'I\'m here to help with product recommendations and store queries. Could you be more specific?',
];

// ── Helpers

function randomPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Main service function

/**
 * Generate a rule-based reply for the given user message.
 * @param {string} userMessage - The raw message from the user.
 * @returns {Promise<string>} The bot's reply text.
 */
async function generateReply(userMessage) {
    // Simulate AI processing latency (500–1500 ms)
    const latency = Math.floor(Math.random() * 1000) + 500;
    await delay(latency);

    const msg = userMessage.toLowerCase().trim();

    // 1. Greetings
    if (GREETING_KEYWORDS.some((kw) => msg.includes(kw))) {
        return randomPick(GREETING_RESPONSES);
    }

    // 2. Help
    if (HELP_KEYWORDS.some((kw) => msg.includes(kw))) {
        return HELP_RESPONSE;
    }

    // 3. Order / shipping
    if (ORDER_KEYWORDS.some((kw) => msg.includes(kw))) {
        return ORDER_RESPONSE;
    }

    // 4. Product-specific with optional price filter
    for (const [product, responses] of Object.entries(PRODUCT_KEYWORDS)) {
        if (msg.includes(product)) {
            // Check for a price cap like "under 2000"
            const priceMatch = msg.match(/under\s*₹?\s*(\d+)/i) || msg.match(/below\s*₹?\s*(\d+)/i);
            if (priceMatch) {
                const cap = priceMatch[1];
                return `Here are ${product} under ₹${cap}:\n${randomPick(responses)}\n\n💡 Filtered for items under ₹${cap}. Want me to refine further?`;
            }
            return randomPick(responses);
        }
    }

    // 5. General price query (no specific product)
    const priceKeywords = ['price', 'cost', 'cheap', 'expensive', 'budget', 'affordable', 'under', 'below'];
    if (priceKeywords.some((kw) => msg.includes(kw))) {
        return randomPick(PRICE_RESPONSES);
    }

    // 6. Fallback
    return randomPick(FALLBACK_RESPONSES);
}

module.exports = { generateReply };
