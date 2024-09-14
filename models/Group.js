import mongoose from "mongoose";

// 그룹 스키마
const GroupSchema = new mongoose.Schema(
  {
    name: { //그룹 이름
      type: String,
      required: true,
      maxLength: 30,
    }, 
    introduction: {
      type: String, // 그룹 소개
      maxLength: 500, 
    },
    isPublic: {
      type: Boolean,
      default: false,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String, // 이미지 URL
      required: true,
    },
    badges: {
      type: Number,
      default: 0, // 획득한 배지 수
    },
    memories: {
      type: Number,
      default: 0, // 추억 수
    },
    empathyCount: {
      type: Number,
      default: 0, // 공감 수
    },
    createdAt: {
      type: Date,
      default: Date.now, // 생성 날짜
    }
  },
  {
    timestamps: true,
  }
);

// 디데이 가상 필드 설정 (생성 후 지난 일수)
GroupSchema.virtual('dDay').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

const Group = mongoose.model("Group", GroupSchema);

export default Group;
