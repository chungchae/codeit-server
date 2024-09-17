import express from "express";
import mongoose from "mongoose";
import Task from "./models/Task.js";
import * as dotenv from 'dotenv';
import cors from 'cors';
import groupRoutes from "./controller/groupController.js"
import userRoutes from "./controller/userController.js"

dotenv.config();

const app = express();
//app 변수를 통해 라우트 생성 가능

app.use(cors());
app.use(express.json());

//MongoDB 연결
mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Connected to DB'));

//Group 처리 api
app.use("/api/groups", groupRoutes);

//User 처리 api
app.use("/api/user", userRoutes);

//3000: 포트 번호, 프로세스 구분을 위한 것
//앱이 실행되면 두번째 함수가 실행됨
//terminal에 node app.js 작성하면 실행됨
app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
