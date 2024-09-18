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

export default router;
