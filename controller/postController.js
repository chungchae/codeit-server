import express from 'express';
import Post from '../models/Post.js';
import Group from '../models/Group.js';
import bcrypt from 'bcrypt';

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


export default router;
