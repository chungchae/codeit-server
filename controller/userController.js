import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../env.js";

const router = express.Router();

// POST: 회원가입
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "이미 가입된 이메일입니다." });
    }

    // 새로운 사용자 생성
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: "회원가입이 성공적으로 완료되었습니다." });
  } catch (error) {
    console.error("회원가입 중 오류가 발생했습니다.", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST: 로그인
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 사용자 확인
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "이메일 또는 비밀번호가 유효하지 않습니다." });
    }

    // 비밀번호 확인
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "이메일 또는 비밀번호가 유효하지 않습니다." });
    }

    // JWT_SECRET 키를 사용해 JWT 토큰 생성
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, message: "로그인이 성공적으로 완료되었습니다." });
  } catch (error) {
    console.error("로그인 중 오류가 발생했습니다.", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST: 로그아웃 (JWT를 클라이언트에서 제거)
router.post("/logout", (req, res) => {
  res.json({ message: "로그아웃이 성공적으로 완료되었습니다." });
});

export default router;
