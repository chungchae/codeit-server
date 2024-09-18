import express from 'express';
import Post from '../models/Post.js';
import Group from '../models/Group.js';
import bcrypt from 'bcrypt';
import Comment from '../models/Comment.js';

const router = express.Router();

// PUT: Update comment
router.put("/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { nickname, content, password } = req.body;

  try {
    // 댓글 존재 여부 확인
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // 댓글 비밀번호 검증
    const isPasswordValid = comment.verifyPassword(password);
    if (!isPasswordValid) {
      return res.status(403).json({ message: "Invalid password." });
    }

    // 댓글 수정
    comment.nickname = nickname || comment.nickname;
    comment.content = content || comment.content;

    const updatedComment = await comment.save();

    res.status(200).json({
      id: updatedComment._id,
      nickname: updatedComment.nickname,
      content: updatedComment.content,
      createdAt: updatedComment.createdAt,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE: 특정 댓글 삭제
router.delete('/:commentId', async (req, res) => {
  const { commentId } = req.params;
  const { password } = req.body;

  try {
    // 댓글 존재 확인
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // 댓글 비밀번호 검증
    const isPasswordValid = comment.verifyPassword(password);
    if (!isPasswordValid) {
      return res.status(403).json({ message: "Invalid password." });
    }

    // 댓글 삭제
    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


export default router;