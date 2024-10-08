import express from "express";
import Group from "../models/Group.js";
import Post from "../models/Post.js";
import asyncHandler from "../utils/asynchandler.js";
import authenticateToken from "../utils/authenticateToken.js";
import Like from "../models/Like.js";

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

// PUT: 그룹 정보 수정
router.put("/:groupId", asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { name, password, imageUrl, isPublic, introduction } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "그룹 이름과 패스워드가 필요합니다." });
  }

  try {
    // groupId로 해당 그룹을 찾고 수정
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,  // 대상 그룹 ID
      { name, password, imageUrl, isPublic, introduction }, //수정할 필드
      { new: true, runValidators: true }
    );

    // 그룹이 존재하지 않을 경우
    if (!updatedGroup) {
      return res.status(404).json({ message: "그룹을 찾을 수 없습니다." });
    }

    // 업데이트된 그룹 반환
    res.json({
      message: "그룹 정보가 업데이트 되었습니다.",
      group: {
        id: updatedGroup._id,
        name: updatedGroup.name,
        imageUrl: updatedGroup.imageUrl,
        isPublic: updatedGroup.isPublic,
        introduction: updatedGroup.introduction,
        likeCount: updatedGroup.likeCount || 0,
        badgeCount: updatedGroup.badgeCount || 0,
        postCount: updatedGroup.postCount || 0,
        createdAt: updatedGroup.createdAt,
      },
    });
  } catch (error) {
    console.error("오류가 발생했습니다.", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}));

// DELETE: 그룹 삭제
router.delete("/:groupId", asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  try {
    // groupId로 해당 그룹을 찾고 삭제
    const deletedGroup = await Group.findByIdAndDelete(groupId);

    // 그룹이 존재하지 않을 경우
    if (!deletedGroup) {
      return res.status(404).json({ message: "그룹을 찾을 수 없습니다." });
    }

    // 성공적으로 삭제된 경우 응답
    res.json({ message: "그룹 삭제 성공" });
  } catch (error) {
    console.error("그룹 삭제 중 오류가 발생했습니다.", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}));

// GET: 그룹 상세 정보 조회
router.get("/:groupId", asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  try {
    // groupId로 그룹을 찾음
    const group = await Group.findById(groupId);

    // 그룹이 존재하지 않을 경우
    if (!group) {
      return res.status(404).json({ message: "그룹을 찾을 수 없습니다." });
    }

    // 응답 데이터 구성
    res.json({
      id: group._id,
      name: group.name,
      imageUrl: group.imageUrl,
      isPublic: group.isPublic,
      likeCount: group.likeCount || 0,
      badges: group.badges || [],
      postCount: group.postCount || 0,
      createdAt: group.createdAt,
      introduction: group.introduction
    });
  } catch (error) {
    console.error("그룹 상세 조회 중 오류가 발생했습니다.", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}));

// POST: 그룹 비밀번호 검증
router.post("/:groupId/verify-password", asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "비밀번호가 필요합니다." });
  }

  try {
    // groupId로 그룹을 찾음
    const group = await Group.findById(groupId);

    // 그룹이 존재하지 않을 경우
    if (!group) {
      return res.status(404).json({ message: "그룹을 찾을 수 없습니다." });
    }

    // 비밀번호 검증
    const isPasswordValid = group.password === password;

    // 비밀번호가 맞는지 여부에 따라 응답
    if (isPasswordValid) {
      res.json({ message: "비밀번호가 일치합니다." });
    } else {
      res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }
  } catch (error) {
    console.error("비밀번호 검증 중 오류가 발생했습니다.", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}));

// POST: 그룹 좋아요
router.post('/:groupId/like', authenticateToken, async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user._id; // 현재 로그인된 사용자 ID

  try {
    // 그룹 존재 확인
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found.' });
    }

    // 이미 공감한 사용자인지 확인
    const existingLike = await Like.findOne({ userId, targetId: groupId, onModel: 'Group' });
    if (existingLike) {
      return res.status(400).json({ message: 'User has already liked this group.' });
    }

    // 좋아요 생성
    const newLike = new Like({ userId, targetId: groupId, onModel: 'Group' });
    await newLike.save();

    // 그룹의 좋아요 수 업데이트
    group.likeCount += 1;
    await group.save();

    res.status(201).json({ message: 'Group liked successfully.' });
  } catch (error) {
    console.error('Error liking group:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET: 그룹의 공개 여부 확인
router.get('/:groupId/is-public', async (req, res) => {
  const { groupId } = req.params;

  try {
    // 그룹 존재 확인
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    // 응답 반환
    res.status(200).json({
      id: group._id,
      isPublic: group.isPublic,
    });
  } catch (error) {
    console.error("Error retrieving group public status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST: 게시글 등록
router.post("/:groupId/posts", async (req, res) => {
  const { groupId } = req.params;
  const { nickname, title, content, postPassword, groupPassword, imageUrl, tags, location, moment, isPublic } = req.body;

  try {
    // 그룹 존재 확인
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    // 그룹 비밀번호 검증
    if (groupPassword !== group.password) {
      return res.status(403).json({ message: "Invalid group password." });
    }

    // 게시글 생성
    const newPost = new Post({
      groupId,
      nickname,
      title,
      content,
      imageUrl,
      tags,
      location,
      moment,
      isPublic,
      password: postPassword,
    });

    const savedPost = await newPost.save();

    res.status(201).json({
      message: "Post created successfully",
      post: savedPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//GET: 게시글 목록 조회
router.get("/:groupId/posts", async (req, res) => {
  const { groupId } = req.params;
  const { page = 1, limit = 10 } = req.query; // 페이지와 한 페이지당 항목 수

  try {
    // 그룹 존재 확인
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    // 게시글 목록 조회
    const totalItemCount = await Post.countDocuments({ groupId });
    const totalPages = Math.ceil(totalItemCount / limit);

    const posts = await Post.find({ groupId })
      .skip((page - 1) * limit) // 페이지네이션
      .limit(Number(limit))
      .sort({ createdAt: -1 }); // 최신 게시글 순으로 정렬

    res.status(200).json({
      currentPage: Number(page),
      totalPages,
      totalItemCount,
      data: posts.map(post => ({
        id: post._id,
        nickname: post.nickname,
        title: post.title,
        imageUrl: post.imageUrl,
        tags: post.tags,
        location: post.location,
        moment: post.memoryMoment,
        isPublic: post.isPublic,
        likeCount: post.empathyCount,
        commentCount: post.commentCount,
        createdAt: post.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
