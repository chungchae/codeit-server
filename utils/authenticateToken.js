import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { JWT_SECRET } from '../env.js';

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (token == null) return res.sendStatus(401); // 인증 실패

  jwt.verify(token, JWT_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403); // 권한 부족

    // DB에서 사용자 정보 가져옴
    const loggedInUser = await User.findById(user.userId);
    if (!loggedInUser) return res.sendStatus(404); // 사용자 없음

    req.user = loggedInUser;
    next();
  });
};

export default authenticateToken;
