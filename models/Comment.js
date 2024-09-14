import mongoose from "mongoose";

// 댓글 스키마
const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Post 스키마와 연결
      required: true,
    },
    nickname: {
      type: String,
      required: true,
      maxLength: 50,
    },
    content: {
      type: String,
      required: true,
      maxLength: 500,
    },
    password: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

// 댓글 비밀번호 검증 메서드
CommentSchema.methods.verifyPassword = function (inputPassword) {
  return this.password === inputPassword;
};

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
