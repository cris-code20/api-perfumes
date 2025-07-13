const pool = require('../config/db');

class Pedido {
  static async getAll() {
    const [rows] = await pool.query(`
      SELECT p.*, c.nombre as cliente_nombre, c.apellidos as cliente_apellidos 
      FROM pedidos p
      JOIN clientes c ON p.cliente_id = c.id
      ORDER BY p.fecha_pedido DESC
    `);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query(`
      SELECT p.*, c.nombre as cliente_nombre, c.apellidos as cliente_apellidos 
      FROM pedidos p
      JOIN clientes c ON p.cliente_id = c.id
      WHERE p.id = ?
    `, [id]);
    return rows[0];
  }

  static async create(pedidoData) {
    const { cliente_id, estado, subtotal, descuento, impuestos, total, direccion_envio, metodo_pago, notas } = pedidoData;
    const [result] = await pool.query(
      'INSERT INTO pedidos (cliente_id, estado, subtotal, descuento, impuestos, total, direccion_envio, metodo_pago, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [cliente_id, estado || 'Pendiente', subtotal, descuento || 0, impuestos || 0, total, direccion_envio, metodo_pago, notas || null]
    );
    return { id: result.insertId, ...pedidoData };
  }

  static async update(id, fields) {
    const allowedFields = ['estado', 'descuento', 'direccion_envio', 'metodo_pago', 'notas'];
    const validFields = {};
    
    for (const key in fields) {
      if (allowedFields.includes(key)) {
        validFields[key] = fields[key];
      }
    }
    
    const setString = Object.keys(validFields).map(key => `${key} = ?`).join(', ');
    const values = Object.values(validFields);
    values.push(id);

    await pool.query(
      `UPDATE pedidos SET ${setString} WHERE id = ?`,
      values
    );
    return this.getById(id);
  }

  static async delete(id) {
    await pool.query('DELETE FROM detalle_pedidos WHERE pedido_id = ?', [id]);
    await pool.query('DELETE FROM pedidos WHERE id = ?', [id]);
    return true;
  }

  static async getDetalles(pedidoId) {
    const [rows] = await pool.query(`
      SELECT dp.*, p.nombre as producto_nombre, p.precio as precio_actual
      FROM detalle_pedidos dp
      JOIN productos p ON dp.producto_id = p.id
      WHERE dp.pedido_id = ?
    `, [pedidoId]);
    return rows;
  }

  static async addDetalle(pedidoId, { producto_id, cantidad, precio_unitario }) {
    const subtotal = cantidad * precio_unitario;
    const [result] = await pool.query(
      'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
      [pedidoId, producto_id, cantidad, precio_unitario, subtotal]
    );
    return { id: result.insertId, pedido_id: pedidoId, producto_id, cantidad, precio_unitario, subtotal };
  }
}

module.exports = Pedido;