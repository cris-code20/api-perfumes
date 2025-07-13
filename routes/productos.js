const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// CRUD básico
router.get('/', productoController.getAllProductos);
router.get('/:id', productoController.getProductoById);
router.post('/', productoController.createProducto);
router.put('/:id', productoController.updateProducto);
router.delete('/:id', productoController.deleteProducto);

// Rutas adicionales
router.get('/marca/:marcaId', productoController.getProductosByMarca);
router.get('/categoria/:categoriaId', productoController.getProductosByCategoria);

module.exports = router;