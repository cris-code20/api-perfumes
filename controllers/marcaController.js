const Marca = require('../models/Marca');

exports.getAllMarcas = async (req, res, next) => {
  try {
    const marcas = await Marca.getAll();
    res.json(marcas);
  } catch (error) {
    next(error);
  }
};

exports.getMarcaById = async (req, res, next) => {
  try {
    const marca = await Marca.getById(req.params.id);
    if (!marca) {
      return res.status(404).json({ message: 'Marca no encontrada' });
    }
    res.json(marca);
  } catch (error) {
    next(error);
  }
};

exports.createMarca = async (req, res, next) => {
  try {
    // Validación básica
    if (!req.body.nombre) {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }

    const nuevaMarca = await Marca.create(req.body);
    res.status(201).json(nuevaMarca);
  } catch (error) {
    next(error);
  }
};

exports.updateMarca = async (req, res, next) => {
  try {
    const marcaActualizada = await Marca.update(req.params.id, req.body);
    if (!marcaActualizada) {
      return res.status(404).json({ message: 'Marca no encontrada' });
    }
    res.json(marcaActualizada);
  } catch (error) {
    next(error);
  }
};

exports.deleteMarca = async (req, res, next) => {
  try {
    await Marca.delete(req.params.id);
    res.json({ message: 'Marca desactivada correctamente' });
  } catch (error) {
    next(error);
  }
};

exports.getProductosByMarca = async (req, res, next) => {
  try {
    const productos = await Marca.getProductos(req.params.id);
    res.json(productos);
  } catch (error) {
    next(error);
  }
};