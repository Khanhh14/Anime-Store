// BE/src/routes/stats.routes.js
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controllers');

// Đường dẫn: GET /api/stats/overview
router.get('/overview', statsController.getStatsOverview);

module.exports = router;