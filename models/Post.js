import mongoose from "mongoose";

// 게시글(추억) 스키마
const PostSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group", // Group 스키마와 연결
      required: true,
    },
    nickname: {
      type: String,
      required: true,
      maxLength: 50,
    },
    title: {
      type: String,
      required: true,
      maxLength: 100,
    },
    image: {
      type: String, // 이미지 URL을 저장하는 필드
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxLength: 1000, // 본문 최대 길이 제한
    },
    tags: {
      type: [String], // 태그는 배열 형태로 저장
    },
    location: {
      type: String, // 장소
      maxLength: 100,
    },
    memoryMoment: {
      type: Date, // 추억의 순간을 저장
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false, // 공개 여부
      required: true,
    },
    password: {
      type: String, // 비밀번호
      required: true,
    },
    empathyCount: {
      type: Number,
      default: 0, // 공감 수
    },
    commentCount: {
      type: Number,
      default: 0, // 댓글 수
    },
  },
  {
    timestamps: true,
  }
);

// 공감 보내기 함수
PostSchema.methods.addEmpathy = function () {
  this.empathyCount += 1;
  return this.save();
};

// 댓글 수 업데이트 함수
PostSchema.methods.updateCommentCount = function (count) {
  this.commentCount = count;
  return this.save();
};

const Post = mongoose.model("Post", PostSchema);

export default Post;
