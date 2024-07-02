import express from "express";
import tasks from "./data/mock.js";

const app = express();
//app 변수를 통해 라우트 생성 가능
app.use(express.json())

//이런 요청이 들어오면 두번째 파라미터인 콜백함수를 실행하라는 뜻
//함수가 간단하면 arrow function을 많이 사용한다
//req: 들어온 요청 객체 res: 돌려줄 응답 객체
app.get("/tasks", (req, res) => {
  //res는 객체를 받으면 json으로 변환해준다
  //sort: oldest면 오래된 task 기준, 나머지 경우 새로운 task 기준
  //count: task 개수

  const sort = req.query.sort;
  const count = Number(req.query.count);

  const compareFn =
    sort === "oldest"
      ? (a, b) => a.createdAt - b.createdAt
      : (a, b) => b.createdAt - a.createdAt;

  let newTasks = tasks.sort(compareFn);

  if (count) {
    newTasks = newTasks.slice(0, count);
  }
  res.send(newTasks);
});

//매번 URL이 바뀌는 dynamic URL을 처리해보자
app.get("/tasks/:id", (req, res) => {
  //params로 전달됨
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);
  if (task) {
    res.send(task);
  } else {
    res.status(404).send({ message: "Cannot find given id. " });
  }
});

app.post('/tasks', (req, res) => {
  const newTask = req.body;
  const ids = tasks.map((task) => task.id);
  newTask.id = Math.max(...ids) +1;
  newTask.isComplete = false;
  newTask.createdAt = new Date();
  newTask.updatedAt = new Date();

  tasks.push(newTask);
  res.status(201).send(newTask);
})

app.patch("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((task) => task.id === id);
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
  const idx = tasks.findIndex((task) => task.id === id);
  if (idx >= 0) {
    tasks.splice(idx, 1);
    res.sendStatus(204);
  } else {
    res.status(404).send({ message: "Cannot find given id." });
  }
})



//3000: 포트 번호, 프로세스 구분을 위한 것
//앱이 실행되면 두번째 함수가 실행됨
//terminal에 node app.js 작성하면 실행됨
app.listen(3000, () => console.log("Server Started"));
