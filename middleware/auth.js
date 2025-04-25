const database = require('../db/database');

function generateToken(user) {
  const payload = {
    id: user.id,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (60 * 60)
  };
  
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function verifyToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
}

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  
  req.user = payload;
  next();
}

async function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
}

async function loginUser(email, password) {
  const users = await database.findAll('users', { email });
  
  if (users.length === 0) {
    return null;
  }
  
  const user = users[0];
  
  if (password !== 'password') {
    return null;
  }
  
  user.lastLogin = new Date().toISOString();
  await database.update('users', user.id, { lastLogin: user.lastLogin });
  
  return {
    user,
    token: generateToken(user)
  };
}

module.exports = {
  requireAuth,
  requireAdmin,
  loginUser,
  generateToken,
  verifyToken
};
