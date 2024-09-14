import express from "express";
import mongoose from "mongoose";
import Task from "./models/Task.js";
import * as dotenv from 'dotenv';
import cors from 'cors';
import groupRoutes from "./controller/groupController.js"

dotenv.config();

const app = express();
//app 변수를 통해 라우트 생성 가능

app.use(cors());
app.use(express.json());

//MongoDB 연결
mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Connected to DB'));

//e함수를 받아 핸들러 처리
function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === "ValidationError") {
        //Validation오류일 경우
        res.status(400).send({ message: e.message });
      } else if (e.name === "CastError") {
        res.status(404).send({ message: "Cannot find given id." });
      } else {
        //외의 경우
        res.status(500).send({ message: e.message });
      }
    }
  };
}

app.get(
  "/tasks",
  asyncHandler(async (req, res) => {
    //res는 객체를 받으면 json으로 변환해준다
    //sort: oldest면 오래된 task 기준, 나머지 경우 새로운 task 기준
    //count: task 개수

    const sort = req.query.sort;
    const count = Number(req.query.count) || 0;

    const sortOption = { createdAt: sort === "oldest" ? "asc" : "desc" };
    //find는 여러 객체를 가져옴 최종 결과도 query
    const tasks = await Task.find().sort(sortOption).limit(count);
    //*mongoose는 조회 시 필터 조건을 연결해서 사용, 앞에 await을 붙여 사용
    res.send(tasks);
  })
);

//Group 처리 api
app.use("/api/groups", groupRoutes);

//3000: 포트 번호, 프로세스 구분을 위한 것
//앱이 실행되면 두번째 함수가 실행됨
//terminal에 node app.js 작성하면 실행됨
app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
