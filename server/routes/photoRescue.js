const express = require('express');
const { callGemini } = require('../gemini');

const router = express.Router();

const FALLBACK_RESPONSE = {
  ok: false,
  source: 'fallback-required',
  errorCode: 'GEMINI_UNAVAILABLE',
  message: 'Gemini is unavailable. Use Quick Rescue checklist.',
};

router.post('/analyze', async (req, res) => {
  const { imageBase64, mimeType, context } = req.body || {};

  if (!imageBase64 || !mimeType || !context) {
    return res.status(400).json(FALLBACK_RESPONSE);
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(200).json(FALLBACK_RESPONSE);
  }

  try {
    const diagnosis = await callGemini(imageBase64, mimeType, context);
    const id = `diag_${Date.now()}`;
    const createdAt = new Date().toISOString();

    return res.json({
      ok: true,
      source: 'gemini',
      diagnosis: {
        id,
        createdAt,
        ...diagnosis,
      },
    });
  } catch (err) {
    console.error('[photo-rescue] Gemini error:', err.message);
    return res.status(200).json(FALLBACK_RESPONSE);
  }
});

module.exports = { analyzeRoute: router };
