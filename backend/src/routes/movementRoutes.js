// backend/src/routes/movementRoutes.js
const express = require('express');
const router = express.Router();
const movementController = require('../controllers/movementController');
const { verifyToken } = require('../middlewares/auth');

router.post('/', verifyToken, movementController.createMovement);
router.get('/dashboard-summary', verifyToken, movementController.getDashboardSummary);

module.exports = router;