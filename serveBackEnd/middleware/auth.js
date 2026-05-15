import jwt from 'jsonwebtoken';
import Role from '../models/Role.js';
import User from '../models/User.js';

const getBearerToken = (req) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  return scheme === 'Bearer' && token ? token : null;
};

const requireAdmin = async (req, res, next) => {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return res.sendStatus(401);
    }

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({ username: payload.username, status: 'Active' })
      .select({ role_id: 1 })
      .lean();

    if (!user) {
      return res.sendStatus(401);
    }

    const role = await Role.findOne({ _id: user.role_id }).select({ role_name: 1 }).lean();
    if (role?.role_name !== 'admin') {
      return res.sendStatus(403);
    }

    req.user = { username: payload.username, role: role.role_name };
    next();
  } catch {
    return res.sendStatus(401);
  }
};

const requireAuthenticated = async (req, res, next) => {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return res.sendStatus(401);
    }

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({ username: payload.username, status: 'Active' })
      .select({ username: 1, role_id: 1 })
      .lean();

    if (!user) {
      return res.sendStatus(401);
    }

    req.user = { id: user._id, username: user.username };
    next();
  } catch {
    return res.sendStatus(401);
  }
};

export { requireAdmin, requireAuthenticated };
