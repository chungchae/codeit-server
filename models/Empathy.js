import mongoose from "mongoose";

// 공감 스키마
const EmpathySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // 공감을 보낸 사용자
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "onModel", // 공감을 받는 대상
    },
    onModel: {
      type: String,
      required: true,
      enum: ["Group", "Post"], // 공감 대상이 그룹인지 게시글인지 구분
    },
    createdAt: {
      type: Date,
      default: Date.now, 
    },
  }
);

const Empathy = mongoose.model("Empathy", EmpathySchema);

export default Empathy;
