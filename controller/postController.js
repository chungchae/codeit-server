import express from 'express';
import Post from '../models/Post.js';
import Group from '../models/Group.js';
import bcrypt from 'bcrypt';
import Comment from '../models/Comment.js';

const router = express.Router();

// POST: 게시글 수정
router.put("/:postId", async (req, res) => {
  const { postId } = req.params;
  const { nickname, title, content, postPassword, imageUrl, tags, location, moment, isPublic } = req.body;

  try {
    // 게시글 존재 확인
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // 게시글 비밀번호 검증
    if (post.password !== postPassword) {
      return res.status(403).json({ message: "Invalid post password." });
    }

    // 게시글 수정
    post.nickname = nickname || post.nickname;
    post.title = title || post.title;
    post.content = content || post.content;
    post.imageUrl = imageUrl || post.imageUrl;
    post.tags = tags || post.tags;
    post.location = location || post.location;
    post.moment = moment || post.moment;
    post.isPublic = isPublic !== undefined ? isPublic : post.isPublic;

    const updatedPost = await post.save();

    res.status(200).json({
      message: "Post updated successfully.",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE: 게시글 삭제
router.delete("/:postId", async (req, res) => {
  const { postId } = req.params;
  const { postPassword } = req.body;

  try {
    // 게시글 존재 확인
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // 게시글 비밀번호 검증
    if (post.password !== postPassword) {
      return res.status(403).json({ message: "Invalid post password." });
    }

    // 게시글 삭제
    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      message: "Post deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET: 게시글 상세 정보 조회
router.get("/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    // 게시글 존재 확인 및 조회
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // 응답에 게시글 정보 반환
    res.status(200).json({
      id: post._id,
      groupId: post.groupId,
      nickname: post.nickname,
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      tags: post.tags,
      location: post.location,
      moment: post.moment,
      isPublic: post.isPublic,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      createdAt: post.createdAt,
    });
  } catch (error) {
    console.error("Error retrieving post details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST: 게시글 비밀번호 검증
router.post("/:postId/verify-password", async (req, res) => {
  const { postId } = req.params;
  const { password } = req.body;

  try {
    // 게시글 존재 확인
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // 비밀번호 검증
    if (post.password !== password) {
      return res.status(403).json({ message: "Invalid post password." });
    }

    // 비밀번호가 맞을 경우 성공 응답
    res.status(200).json({ message: "Password verified successfully." });
  } catch (error) {
    console.error("Error verifying post password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET: 게시글 공개 여부 확인
router.get("/:postId/is-public", async (req, res) => {
  const { postId } = req.params;

  try {
    // 게시글 존재 확인
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // 공개 여부 반환
    res.status(200).json({
      id: post._id,
      isPublic: post.isPublic,
    });
  } catch (error) {
    console.error("Error fetching post visibility status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST: 댓글 등록
router.post("/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const { nickname, content, password } = req.body;

  try {
    // 게시글 존재 확인
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // 새로운 댓글 생성
    const newComment = new Comment({
      postId,
      nickname,
      content,
      password,
    });

    const savedComment = await newComment.save();

    // 성공적으로 등록된 댓글 응답
    res.status(201).json({
      id: savedComment._id,
      nickname: savedComment.nickname,
      content: savedComment.content,
      createdAt: savedComment.createdAt,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET: 특정 게시글의 댓글 목록 조회
router.get("/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  const { page = 1, limit = 10 } = req.query; // 기본 페이지와 한 페이지당 항목 수 설정

  try {
    // 게시글 존재 확인
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // 댓글 목록 가져오기 및 페이징 처리
    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 }) // 최신 댓글 순으로 정렬
      .skip((page - 1) * limit) // 페이지 건너뛰기
      .limit(Number(limit)); // 한 페이지당 항목 수 제한

    // 전체 댓글 수
    const totalItemCount = await Comment.countDocuments({ postId });
    const totalPages = Math.ceil(totalItemCount / limit);

    // 응답 데이터 생성
    const responseData = {
      currentPage: Number(page),
      totalPages,
      totalItemCount,
      data: comments.map(comment => ({
        id: comment._id,
        nickname: comment.nickname,
        content: comment.content,
        createdAt: comment.createdAt,
      })),
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


export default router;
