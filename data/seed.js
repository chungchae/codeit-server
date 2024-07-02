import mongoose from "mongoose";
import data from "./mock.js";
import Task from "../models/Task.js";
import { DATABASE_URL } from "../env.js";

//id필드는 modgoDB가 알아서 삽입할 것
mongoose.connect(DATABASE_URL);

//모든 데이터 삭제 후 data의 데이터를 insert
await Task.deleteMany({});
await Task.insertMany(data);

//연결 종료
mongoose.connection.close();