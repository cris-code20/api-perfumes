const Pedido = require('../models/Pedido');

exports.getAllPedidos = async (req, res, next) => {
  try {
    const pedidos = await Pedido.getAll();
    res.json(pedidos);
  } catch (error) {
    next(error);
  }
};

exports.getPedidoById = async (req, res, next) => {
  try {
    const pedido = await Pedido.getById(req.params.id);
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    
    // Obtener detalles del pedido
    pedido.detalles = await Pedido.getDetalles(req.params.id);
    res.json(pedido);
  } catch (error) {
    next(error);
  }
};

exports.createPedido = async (req, res, next) => {
  try {
    if (!req.body.cliente_id || !req.body.total || !req.body.direccion_envio || !req.body.metodo_pago) {
      return res.status(400).json({ message: 'Datos incompletos para crear el pedido' });
    }
    
    const nuevoPedido = await Pedido.create(req.body);
    res.status(201).json(nuevoPedido);
  } catch (error) {
    next(error);
  }
};

exports.updatePedido = async (req, res, next) => {
  try {
    const pedidoActualizado = await Pedido.update(req.params.id, req.body);
    if (!pedidoActualizado) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    res.json(pedidoActualizado);
  } catch (error) {
    next(error);
  }
};

exports.deletePedido = async (req, res, next) => {
  try {
    await Pedido.delete(req.params.id);
    res.json({ message: 'Pedido eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

exports.addDetallePedido = async (req, res, next) => {
  try {
    if (!req.body.producto_id || !req.body.cantidad || !req.body.precio_unitario) {
      return res.status(400).json({ message: 'Datos incompletos para el detalle' });
    }
    
    const detalle = await Pedido.addDetalle(req.params.id, req.body);
    res.status(201).json(detalle);
  } catch (error) {
    next(error);
  }
};

exports.getDetallesPedido = async (req, res, next) => {
  try {
    const detalles = await Pedido.getDetalles(req.params.id);
    res.json(detalles);
  } catch (error) {
    next(error);
  }
};