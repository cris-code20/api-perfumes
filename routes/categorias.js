const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriasController');

router.get('/', categoriaController.getAllCategorias);
router.get('/:id', categoriaController.getCategoriaById);
router.post('/', categoriaController.createCategoria);
router.put('/:id', categoriaController.updateCategoria);
router.delete('/:id', categoriaController.deleteCategoria);
router.get('/:id/productos', categoriaController.getProductosByCategoria);

module.exports = router;