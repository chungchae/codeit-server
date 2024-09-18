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
    content: {
      type: String,
      required: true,
      maxLength: 1000, // 본문 최대 길이 제한
    },
    imageUrl: {
      type: String, // 이미지 URL
    },
    tags: {
      type: [String], // 태그는 배열 형태로 저장
    },
    location: {
      type: String, // 장소
      maxLength: 100,
    },
    moment: {
      type: Date, // 추억의 순간
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false, // 공개 여부
      required: true,
    },
    likeCount: {
      type: Number,
      default: 0, // 좋아요 수
    },
    commentCount: {
      type: Number,
      default: 0, // 댓글 수
    },
    password: {
      type: String, // 게시글 비밀번호
      required: true,
    },
  },
  {
    timestamps: true, // 생성 및 업데이트 타임스탬프 자동 추가
  }
);


// 공감(좋아요) 추가 함수
PostSchema.methods.addLike = function () {
  this.likeCount += 1;
  return this.save();
};

// 댓글 수 업데이트 함수
PostSchema.methods.updateCommentCount = function (count) {
  this.commentCount = count;
  return this.save();
};

const Post = mongoose.model("Post", PostSchema);

export default Post;
