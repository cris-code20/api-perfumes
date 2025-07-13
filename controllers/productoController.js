const Producto = require('../models/Producto');

exports.getAllProductos = async (req, res, next) => {
  try {
    const productos = await Producto.getAll();
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

exports.getProductoById = async (req, res, next) => {
  try {
    const producto = await Producto.getById(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    next(error);
  }
};

exports.createProducto = async (req, res, next) => {
  try {
    const nuevoProducto = await Producto.create(req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    next(error);
  }
};

exports.updateProducto = async (req, res, next) => {
  try {
    const productoActualizado = await Producto.update(req.params.id, req.body);
    res.json(productoActualizado);
  } catch (error) {
    next(error);
  }
};

exports.deleteProducto = async (req, res, next) => {
  try {
    await Producto.delete(req.params.id);
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

exports.getProductosByMarca = async (req, res, next) => {
  try {
    const productos = await Producto.getByMarca(req.params.marcaId);
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

exports.getProductosByCategoria = async (req, res, next) => {
  try {
    const productos = await Producto.getByCategoria(req.params.categoriaId);
    res.json(productos);
  } catch (error) {
    next(error);
  }
};