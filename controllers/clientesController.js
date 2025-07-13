const Clientes = require('../models/Clientes');

exports.getAllClientes = async (req, res, next) => {
  try {
    const Cliente = await Clientes.getAll();
    res.json(Cliente);
  } catch (error) {
    next(error);
  }
};

exports.getClientesById = async (req, res, next) => {
  try {
    const Client = await Clientes.getById(req.params.id);
    if (!Client) {
      return res.status(404).json({ message: 'Clientes no encontrado' });
    }
    res.json(Clientes);
  } catch (error) {
    next(error);
  }
};

exports.createClientes = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.nombre || !req.body.apellidos) {
      return res.status(400).json({ message: 'Email, nombre y apellidos son requeridos' });
    }
    const nuevoClientes = await Clientes.create(req.body);
    res.status(201).json(nuevoClientes);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    next(error);
  }
};

exports.updateClientes = async (req, res, next) => {
  try {
    const ClientesActualizado = await Clientes.update(req.params.id, req.body);
    if (!ClientesActualizado) {
      return res.status(404).json({ message: 'Clientes no encontrado' });
    }
    res.json(ClientesActualizado);
  } catch (error) {
    next(error);
  }
};

exports.deleteClientes = async (req, res, next) => {
  try {
    await Clientes.delete(req.params.id);
    res.json({ message: 'Clientes desactivado correctamente' });
  } catch (error) {
    next(error);
  }
};

exports.getPedidosByClientes = async (req, res, next) => {
  try {
    const pedidos = await Clientes.getPedidos(req.params.id);
    res.json(pedidos);
  } catch (error) {
    next(error);
  }
};