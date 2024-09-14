import express from "express";
import Group from "../models/Group.js";
import asyncHandler from "../utils/asynchandler.js";

const router = express.Router();

// POST: 그룹 등록 API
router.post("/", asyncHandler(async (req, res) => {
  const { name, password, imageUrl, isPublic, introduction } = req.body;

  // 필수 필드 검증
  if (!name || !password) {
    return res.status(400).json({ message: "Group name and password are required." });
  }

  const newGroup = new Group({
    name,
    password,
    imageUrl,
    isPublic,
    introduction,
  });

  const savedGroup = await newGroup.save();

  res.status(201).json({
    message: "Group created successfully",
    group: savedGroup,
  });
}));

// GET: 그룹 조회 API
router.get("/", asyncHandler(async (req, res) => {
  // 쿼리 파라미터로 페이지 번호와 페이지당 항목 수를 받음
  const page = parseInt(req.query.page) || 1; // 기본값 1
  const limit = parseInt(req.query.limit) || 10; // 기본값 10

  // 전체 그룹 개수를 계산
  const totalItemCount = await Group.countDocuments();

  // 페이지 수 계산
  const totalPages = Math.ceil(totalItemCount / limit);

  // 요청한 페이지의 그룹 목록을 가져옴 (페이지네이션 처리)
  const groups = await Group.find()
    .sort({ createdAt: -1 })  // 최신 순으로 정렬
    .skip((page - 1) * limit)
    .limit(limit);

  // 데이터 포맷 설정
  const data = groups.map(group => ({
    id: group._id,
    name: group.name,
    imageUrl: group.imageUrl,
    isPublic: group.isPublic,
    likeCount: group.likeCount || 0, // 기본값 설정
    badgeCount: group.badgeCount || 0,
    postCount: group.postCount || 0,
    createdAt: group.createdAt,
    introduction: group.introduction
  }));

  // 응답 데이터
  res.json({
    currentPage: page,
    totalPages,
    totalItemCount,
    data,
  });
}));

export default router;
