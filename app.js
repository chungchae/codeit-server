import express from "express";
import mockTasks from "./data/mock.js";
import mongoose from "mongoose";
import { DATABASE_URL } from "./env.js";
import Task from "./models/Task.js";

const app = express();
//app 변수를 통해 라우트 생성 가능
app.use(express.json())

//MongoDB 연결
mongoose.connect(DATABASE_URL).then(() => console.log('Connected to DB'));

//이런 요청이 들어오면 두번째 파라미터인 콜백함수를 실행하라는 뜻
//함수가 간단하면 arrow function을 많이 사용한다
//req: 들어온 요청 객체 res: 돌려줄 응답 객체
app.get("/tasks", async (req, res) => {
  //res는 객체를 받으면 json으로 변환해준다
  //sort: oldest면 오래된 task 기준, 나머지 경우 새로운 task 기준
  //count: task 개수

  const sort = req.query.sort;
  const count = Number(req.query.count) || 0;

  const sortOption = { createdAt: sort === 'oldest' ? 'asc' : 'desc'}
  //find는 여러 객체를 가져옴 최종 결과도 query
  const tasks = await Task.find().sort(sortOption).limit(count);
  //*mongoose는 조회 시 필터 조건을 연결해서 사용, 앞에 await을 붙여 사용
  res.send(tasks);
});

//매번 URL이 바뀌는 dynamic URL을 처리해보자
app.get("/tasks/:id", async (req, res) => {
  //params로 전달됨
  //mongo는 findByid라는 메소드를 제공한다.
  const id = req.params.id;
  const task = await Task.findById(id);
  if (task) {
    res.send(task);
  } else {
    res.status(404).send({ message: "Cannot find given id. " });
  }
});

app.post('/tasks', async (req, res) => {
  const newTask = await Task.create(req.body)
  res.status(201).send(newTask);
}) 

app.patch("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = mockTasks.find((task) => task.id === id);
  if (task) {
    Object.keys(req.body).forEach((key)=>{
      task[key] = req.body[key];
    })
    task.updatedAt = new Date();
    res.send(task);
  } else {
    res.status(404).send({ message: "Cannot find given id. " });
  }
});

app.delete("/tasks/:id", (req, res) => {
  //params로 전달됨!
  const id = Number(req.params.id);
  const idx = mockTasks.findIndex((task) => task.id === id);
  if (idx >= 0) {
    mockTasks.splice(idx, 1);
    res.sendStatus(204);
  } else {
    res.status(404).send({ message: "Cannot find given id." });
  }
})



//3000: 포트 번호, 프로세스 구분을 위한 것
//앱이 실행되면 두번째 함수가 실행됨
//terminal에 node app.js 작성하면 실행됨
app.listen(3000, () => console.log("Server Started"));
