const Categoria = require('../models/Categorias');

exports.getAllCategorias = async (req, res, next) => {
  try {
    const categorias = await Categoria.getAll();
    res.json(categorias);
  } catch (error) {
    next(error);
  }
};

exports.getCategoriaById = async (req, res, next) => {
  try {
    const categoria = await Categoria.getById(req.params.id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json(categoria);
  } catch (error) {
    next(error);
  }
};

exports.createCategoria = async (req, res, next) => {
  try {
    if (!req.body.nombre) {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }
    const nuevaCategoria = await Categoria.create(req.body);
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    next(error);
  }
};

exports.updateCategoria = async (req, res, next) => {
  try {
    const categoriaActualizada = await Categoria.update(req.params.id, req.body);
    if (!categoriaActualizada) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json(categoriaActualizada);
  } catch (error) {
    next(error);
  }
};

exports.deleteCategoria = async (req, res, next) => {
  try {
    await Categoria.delete(req.params.id);
    res.json({ message: 'Categoría desactivada correctamente' });
  } catch (error) {
    next(error);
  }
};

exports.getProductosByCategoria = async (req, res, next) => {
  try {
    const productos = await Categoria.getProductos(req.params.id);
    res.json(productos);
  } catch (error) {
    next(error);
  }
};