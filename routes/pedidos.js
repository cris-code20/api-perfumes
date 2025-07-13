const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.get('/', pedidoController.getAllPedidos);
router.get('/:id', pedidoController.getPedidoById);
router.post('/', pedidoController.createPedido);
router.put('/:id', pedidoController.updatePedido);
router.delete('/:id', pedidoController.deletePedido);

// Rutas para detalles del pedido
router.get('/:id/detalles', pedidoController.getDetallesPedido);
router.post('/:id/detalles', pedidoController.addDetallePedido);

module.exports = router;