const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const verifyToken = require('../middlewares/authMiddleware'); // Importa o Cão de Guarda

// PÚBLICO: Qualquer um pode ver o cardápio
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// PRIVADO: Só quem tem o Crachá (verifyToken) pode mexer no estoque
router.post('/', verifyToken, productController.createProduct);
router.put('/:id', verifyToken, productController.updateProduct);
router.delete('/:id', verifyToken, productController.deleteProduct);

module.exports = router;