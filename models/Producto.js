const pool = require('../config/db');

class Producto {
  static async getAll() {
    const [rows] = await pool.query(`
      SELECT p.*, m.nombre as marca_nombre, c.nombre as categoria_nombre 
      FROM productos p
      LEFT JOIN marcas m ON p.marca_id = m.id
      LEFT JOIN categorias c ON p.categoria_id = c.id
    `);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query(`
      SELECT p.*, m.nombre as marca_nombre, c.nombre as categoria_nombre 
      FROM productos p
      LEFT JOIN marcas m ON p.marca_id = m.id
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = ?
    `, [id]);
    return rows[0];
  }

  static async create({
    nombre, marca_id, categoria_id, precio, precio_oferta, stock, 
    ml_contenido, genero, descripcion, notas_salida, notas_corazon, 
    notas_fondo, imagen_url, activo
  }) {
    const [result] = await pool.query(
      `INSERT INTO productos (
        nombre, marca_id, categoria_id, precio, precio_oferta, stock,
        ml_contenido, genero, descripcion, notas_salida, notas_corazon,
        notas_fondo, imagen_url, activo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre, marca_id, categoria_id, precio, precio_oferta, stock,
        ml_contenido, genero, descripcion, notas_salida, notas_corazon,
        notas_fondo, imagen_url, activo
      ]
    );
    return { id: result.insertId, ...arguments[0] };
  }

  static async update(id, fields) {
    const setString = Object.keys(fields)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = Object.values(fields);
    values.push(id);

    await pool.query(
      `UPDATE productos SET ${setString} WHERE id = ?`,
      values
    );
    return this.getById(id);
  }

  static async delete(id) {
    await pool.query('DELETE FROM productos WHERE id = ?', [id]);
    return true;
  }

  static async getByMarca(marcaId) {
    const [rows] = await pool.query(
      'SELECT * FROM productos WHERE marca_id = ?',
      [marcaId]
    );
    return rows;
  }

  static async getByCategoria(categoriaId) {
    const [rows] = await pool.query(
      'SELECT * FROM productos WHERE categoria_id = ?',
      [categoriaId]
    );
    return rows;
  }
}

module.exports = Producto;