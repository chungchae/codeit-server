import mongoose from "mongoose";

// 좋아요(Like) 스키마
const LikeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // 좋아요를 누른 사용자
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "onModel", // 좋아요를 받는 대상
    },
    onModel: {
      type: String,
      required: true,
      enum: ["Group", "Post"], // 좋아요 대상이 그룹인지 게시글인지 구분
    },
    createdAt: {
      type: Date,
      default: Date.now, 
    },
  }
);

const Like = mongoose.model("Like", LikeSchema);

export default Like;
