import mongoose from "mongoose";

// 그룹 배지 스키마
const GroupBadgeSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group", // Group 스키마와 연결
      required: true,
    },
    badgeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Badge", // Badge 스키마와 연결
      required: true,
    },
    obtainedAt: {
      type: Date, // 배지를 획득한 날짜
      default: Date.now,
    }
  }
);

const GroupBadge = mongoose.model("GroupBadge", GroupBadgeSchema);

export default GroupBadge;
