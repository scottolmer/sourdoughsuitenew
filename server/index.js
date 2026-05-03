require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { analyzeRoute } = require('./routes/photoRescue');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({ limit: '35mb' }));
app.use((err, req, res, next) => {
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({
      ok: false,
      source: 'fallback-required',
      errorCode: 'PHOTO_TOO_LARGE',
      message: 'That photo is too large to analyze. Choose a smaller image or screenshot and try again.',
    });
  }
  return next(err);
});
app.use(express.static('docs'));

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'sourdough-suite-api',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

app.use('/api/photo-rescue', analyzeRoute);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[server] sourdough-suite-api running on port ${PORT}`);
  console.log(`[server] Gemini configured: ${Boolean(process.env.GEMINI_API_KEY)}`);
});
