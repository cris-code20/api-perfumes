const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clientesController');

router.get('/', clienteController.getAllClientes);
router.get('/:id', clienteController.getClientesById);
router.post('/', clienteController.createClientes);
router.put('/:id', clienteController.updateClientes);
router.delete('/:id', clienteController.deleteClientes);
router.get('/:id/pedidos', clienteController.getPedidosByClientes);

module.exports = router;