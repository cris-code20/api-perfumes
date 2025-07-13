const pool = require('../config/db');

class Marca {
  // Obtener todas las marcas
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM marcas WHERE activo = TRUE');
    return rows;
  }

  // Buscar marca por ID
  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM marcas WHERE id = ? AND activo = TRUE', [id]);
    return rows[0];
  }

  // Crear nueva marca
  static async create({ nombre, pais_origen, descripcion }) {
    const [result] = await pool.query(
      'INSERT INTO marcas (nombre, pais_origen, descripcion) VALUES (?, ?, ?)',
      [nombre, pais_origen, descripcion]
    );
    return { id: result.insertId, nombre, pais_origen, descripcion };
  }

  // Actualizar marca
  static async update(id, { nombre, pais_origen, descripcion, activo }) {
    await pool.query(
      'UPDATE marcas SET nombre = ?, pais_origen = ?, descripcion = ?, activo = ? WHERE id = ?',
      [nombre, pais_origen, descripcion, activo, id]
    );
    return this.getById(id);
  }

  // Eliminar marca (soft delete)
  static async delete(id) {
    await pool.query('UPDATE marcas SET activo = FALSE WHERE id = ?', [id]);
    return true;
  }

  // Obtener productos de una marca
  static async getProductos(marcaId) {
    const [rows] = await pool.query(
      'SELECT * FROM productos WHERE marca_id = ? AND activo = TRUE',
      [marcaId]
    );
    return rows;
  }
}

module.exports = Marca;