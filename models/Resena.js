const pool = require('../config/db');

class Resena {
  static async getAll() {
    const [rows] = await pool.query(`
      SELECT r.*, p.nombre as producto_nombre, c.nombre as cliente_nombre, c.apellidos as cliente_apellidos
      FROM resenas r
      JOIN productos p ON r.producto_id = p.id
      JOIN clientes c ON r.cliente_id = c.id
      ORDER BY r.fecha_resena DESC
    `);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query(`
      SELECT r.*, p.nombre as producto_nombre, c.nombre as cliente_nombre, c.apellidos as cliente_apellidos
      FROM resenas r
      JOIN productos p ON r.producto_id = p.id
      JOIN clientes c ON r.cliente_id = c.id
      WHERE r.id = ?
    `, [id]);
    return rows[0];
  }

  static async create({ producto_id, cliente_id, calificacion, comentario }) {
    const [result] = await pool.query(
      'INSERT INTO resenas (producto_id, cliente_id, calificacion, comentario) VALUES (?, ?, ?, ?)',
      [producto_id, cliente_id, calificacion, comentario]
    );
    return { id: result.insertId, producto_id, cliente_id, calificacion, comentario };
  }

  static async update(id, { calificacion, comentario }) {
    await pool.query(
      'UPDATE resenas SET calificacion = ?, comentario = ? WHERE id = ?',
      [calificacion, comentario, id]
    );
    return this.getById(id);
  }

  static async delete(id) {
    await pool.query('DELETE FROM resenas WHERE id = ?', [id]);
    return true;
  }

  static async getByProducto(productoId) {
    const [rows] = await pool.query(`
      SELECT r.*, c.nombre as cliente_nombre, c.apellidos as cliente_apellidos
      FROM resenas r
      JOIN clientes c ON r.cliente_id = c.id
      WHERE r.producto_id = ?
      ORDER BY r.fecha_resena DESC
    `, [productoId]);
    return rows;
  }

  static async getByCliente(clienteId) {
    const [rows] = await pool.query(`
      SELECT r.*, p.nombre as producto_nombre
      FROM resenas r
      JOIN productos p ON r.producto_id = p.id
      WHERE r.cliente_id = ?
      ORDER BY r.fecha_resena DESC
    `, [clienteId]);
    return rows;
  }
}

module.exports = Resena;