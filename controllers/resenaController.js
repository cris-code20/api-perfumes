const Resena = require('../models/Resena');

exports.getAllResenas = async (req, res, next) => {
  try {
    const resenas = await Resena.getAll();
    res.json(resenas);
  } catch (error) {
    next(error);
  }
};

exports.getResenaById = async (req, res, next) => {
  try {
    const resena = await Resena.getById(req.params.id);
    if (!resena) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }
    res.json(resena);
  } catch (error) {
    next(error);
  }
};

exports.createResena = async (req, res, next) => {
  try {
    if (!req.body.producto_id || !req.body.cliente_id || !req.body.calificacion) {
      return res.status(400).json({ message: 'Datos incompletos para la reseña' });
    }
    
    if (req.body.calificacion < 1 || req.body.calificacion > 5) {
      return res.status(400).json({ message: 'La calificación debe ser entre 1 y 5' });
    }
    
    const nuevaResena = await Resena.create(req.body);
    res.status(201).json(nuevaResena);
  } catch (error) {
    next(error);
  }
};

exports.updateResena = async (req, res, next) => {
  try {
    if (req.body.calificacion && (req.body.calificacion < 1 || req.body.calificacion > 5)) {
      return res.status(400).json({ message: 'La calificación debe ser entre 1 y 5' });
    }
    
    const resenaActualizada = await Resena.update(req.params.id, req.body);
    if (!resenaActualizada) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }
    res.json(resenaActualizada);
  } catch (error) {
    next(error);
  }
};

exports.deleteResena = async (req, res, next) => {
  try {
    await Resena.delete(req.params.id);
    res.json({ message: 'Reseña eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

exports.getResenasByProducto = async (req, res, next) => {
  try {
    const resenas = await Resena.getByProducto(req.params.id);
    res.json(resenas);
  } catch (error) {
    next(error);
  }
};

exports.getResenasByCliente = async (req, res, next) => {
  try {
    const resenas = await Resena.getByCliente(req.params.id);
    res.json(resenas);
  } catch (error) {
    next(error);
  }
};