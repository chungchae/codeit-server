import mongoose from "mongoose";

// 배지 스키마
const BadgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    }
  }
);

const Badge = mongoose.model("Badge", BadgeSchema);

export default Badge;
