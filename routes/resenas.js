const express = require('express');
const router = express.Router();
const resenaController = require('../controllers/resenaController');

router.get('/', resenaController.getAllResenas);
router.get('/:id', resenaController.getResenaById);
router.post('/', resenaController.createResena);
router.put('/:id', resenaController.updateResena);
router.delete('/:id', resenaController.deleteResena);

// Rutas adicionales
router.get('/producto/:id', resenaController.getResenasByProducto);
router.get('/cliente/:id', resenaController.getResenasByCliente);

module.exports = router;