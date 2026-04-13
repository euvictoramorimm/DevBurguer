const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Definindo que uma requisição GET na raiz dessa rota vai acionar a função getAllProducts
router.get('/', productController.getAllProducts);
router.post('/', productController.createProduct);

router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

router.get('/:id', productController.getProductById); 

module.exports = router;