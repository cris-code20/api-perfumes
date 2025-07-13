const pool = require('../config/db');

class Categoria {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM categorias WHERE activo = TRUE');
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM categorias WHERE id = ? AND activo = TRUE', [id]);
    return rows[0];
  }

  static async create({ nombre, descripcion }) {
    const [result] = await pool.query(
      'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
      [nombre, descripcion]
    );
    return { id: result.insertId, nombre, descripcion };
  }

  static async update(id, { nombre, descripcion, activo }) {
    await pool.query(
      'UPDATE categorias SET nombre = ?, descripcion = ?, activo = ? WHERE id = ?',
      [nombre, descripcion, activo, id]
    );
    return this.getById(id);
  }

  static async delete(id) {
    await pool.query('UPDATE categorias SET activo = FALSE WHERE id = ?', [id]);
    return true;
  }

  static async getProductos(categoriaId) {
    const [rows] = await pool.query(
      'SELECT * FROM productos WHERE categoria_id = ? AND activo = TRUE',
      [categoriaId]
    );
    return rows;
  }
}

module.exports = Categoria;