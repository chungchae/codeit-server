import mongoose from "mongoose";

//스키마 만들기
const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 30,
      validate: {
        validator: function (title) {
          return title.split(" ").length > 1;
        },
        message: "Must contain at least 2 words",
      },
    },
    description: {
      type: String,
    },
    isComplete: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//mongoDB 에서 다룰 컬렉션 이름. Task라는 이름의 컬렉션에 각종 기능을 수행
const Task = mongoose.model("Task", TaskSchema);

export default Task;
