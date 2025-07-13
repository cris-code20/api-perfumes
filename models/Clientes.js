const pool = require('../config/db');

class Cliente {
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE activo = TRUE');
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ? AND activo = TRUE', [id]);
    return rows[0];
  }

  static async create(clienteData) {
    const { nombre, apellidos, email, telefono, fecha_nacimiento, genero, direccion, ciudad, codigo_postal, pais } = clienteData;
    const [result] = await pool.query(
      'INSERT INTO clientes (nombre, apellidos, email, telefono, fecha_nacimiento, genero, direccion, ciudad, codigo_postal, pais) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellidos, email, telefono, fecha_nacimiento, genero, direccion, ciudad, codigo_postal, pais || 'República Dominicana']
    );
    return { id: result.insertId, ...clienteData };
  }

  static async update(id, fields) {
    const allowedFields = ['nombre', 'apellidos', 'telefono', 'direccion', 'ciudad', 'codigo_postal', 'pais', 'activo'];
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
      `UPDATE clientes SET ${setString} WHERE id = ?`,
      values
    );
    return this.getById(id);
  }

  static async delete(id) {
    await pool.query('UPDATE clientes SET activo = FALSE WHERE id = ?', [id]);
    return true;
  }

  static async getPedidos(clienteId) {
    const [rows] = await pool.query(
      'SELECT * FROM pedidos WHERE cliente_id = ? ORDER BY fecha_pedido DESC',
      [clienteId]
    );
    return rows;
  }
}

module.exports = Cliente;