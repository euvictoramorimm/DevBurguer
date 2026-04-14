const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota do painel de controle (Admin)
router.post('/admin-login', authController.adminLogin);

// Rotas da vitrine (Clientes)
router.post('/register', authController.registerClient);
router.post('/login', authController.clientLogin);

module.exports = router;