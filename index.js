// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// require('dotenv').config({ debug: false });

// // Importar rutas
// const productosRouter = require('./routes/productos');
// const marcasRouter = require('./routes/marcas');
// const categoriasRouter = require('./routes/categorias');
// const clientesRouter = require('./routes/clientes');
// const pedidosRouter = require('./routes/pedidos');
// // const resenasRouter = require('./routes/resenas');

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(bodyParser.json());

// // Rutas
// app.use('/api/marcas', marcasRouter);
// app.use('/api/categorias', categoriasRouter);
// app.use('/api/productos', productosRouter);
// app.use('/api/clientes', clientesRouter);
// app.use('/api/pedidos', pedidosRouter);
// // app.use('/api/resenas', resenasRouter);

// // Manejador de errores
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ 
//     error: 'Algo salió mal!',
//     message: err.message 
//   });
// });

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Servidor corriendo en puerto ${PORT}`);
// });

// app.js o server.js - Archivo principal de tu aplicación
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config({ debug: false });

// Importar rutas
const productosRouter = require('./routes/productos');
const marcasRouter = require('./routes/marcas');
const categoriasRouter = require('./routes/categorias');
const clientesRouter = require('./routes/clientes');
const pedidosRouter = require('./routes/pedidos');
// const resenasRouter = require('./routes/resenas');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Middleware de autenticación JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Token de acceso requerido' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        error: 'Token inválido o expirado' 
      });
    }
    req.user = user;
    next();
  });
};

// Middleware opcional para verificar roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuario no autenticado' 
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'No tienes permisos suficientes' 
      });
    }
    
    next();
  };
};

// Rutas de autenticación
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }

    // Aquí deberías validar contra tu base de datos
    // Este es un ejemplo básico
    const user = await validateUser(email, password);

    if (!user) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '24h' 
      }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
});

// Ruta para renovar token
app.post('/api/auth/refresh', authenticateToken, (req, res) => {
  const newToken = jwt.sign(
    { 
      id: req.user.id,
      email: req.user.email,
      role: req.user.role 
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '24h' 
    }
  );

  res.json({
    message: 'Token renovado exitosamente',
    token: newToken
  });
});

// Ruta protegida de ejemplo
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  res.json({
    message: 'Perfil de usuario',
    user: req.user
  });
});

// Middleware para proteger solo las operaciones que no sean GET
const protectNonGET = (req, res, next) => {
  // Si es GET, permitir acceso público
  if (req.method === 'GET') {
    return next();
  }
  
  // Para otros métodos (POST, PUT, DELETE), requiere autenticación
  authenticateToken(req, res, (err) => {
    if (err) return next(err);
    
    // Solo admin puede hacer operaciones de modificación
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Solo los administradores pueden realizar esta acción',
        allowedRole: 'admin',
        userRole: req.user.role
      });
    }
    
    next();
  });
};

// Rutas con acceso público para GET y protegidas para otras operaciones
app.use('/api/marcas', protectNonGET, marcasRouter);
app.use('/api/categorias', protectNonGET, categoriasRouter);
app.use('/api/productos', protectNonGET, productosRouter);
app.use('/api/clientes', protectNonGET, clientesRouter);
app.use('/api/pedidos', protectNonGET, pedidosRouter);
// app.use('/api/resenas', protectNonGET, resenasRouter);

// Rutas con autorización por roles
app.get('/api/admin/stats', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.json({
    message: 'Estadísticas del sistema',
    totalProducts: 150,
    totalUsers: 45,
    totalOrders: 230,
    user: req.user
  });
});

// Ruta para obtener información del usuario autenticado
app.get('/api/user/info', authenticateToken, (req, res) => {
  res.json({
    message: 'Información del usuario',
    user: req.user,
    permissions: req.user.role === 'admin' ? 
      ['create', 'read', 'update', 'delete'] : 
      ['read']
  });
});

// Función auxiliar para validar usuario (reemplaza con tu lógica de BD)
async function validateUser(email, password) {
  // IMPORTANTE: Reemplaza esto con tu lógica de base de datos
  // Este es solo un ejemplo para demostración
  const users = [
    {
      id: 1,
      email: 'admin@ejemplo.com',
      password: '$2b$10$8K1p/a0dCGfXCNzqJmKSyuJmWHkHEPTxLKGlXcQDZk.6/qH6jWQK6', // "admin123"
      role: 'admin'
    },
    {
      id: 2,
      email: 'usuario@ejemplo.com',
      password: '$2b$10$8K1p/a0dCGfXCNzqJmKSyuJmWHkHEPTxLKGlXcQDZk.6/qH6jWQK6', // "user123"
      role: 'user'
    }
  ];

  const user = users.find(u => u.email === email);
  
  if (!user) {
    return null;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  
  if (!isValidPassword) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role
  };
}

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Algo salió mal!',
    message: err.message
  });
});

const PORT =  3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;