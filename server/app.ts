import express from "express";
import cors from "cors";
import {todoRoute} from "./api/todo.api";

export const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use('/api/todo', todoRoute);
