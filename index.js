import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { loginValidation, registerValidation } from "./validations/auth.js";
import checkAuth from "./middlewares/checkAuth.js";
import * as PostController from "./controllers/PostController.js";

import * as UserController from "./controllers/UserController.js";
import { postCreateValidation } from "./validations/post.js";

const app = express();
const PORT = 4444;

mongoose
  .connect(
    "mongodb+srv://uantredogbusiness:tmxn6w3t1@cluster0.pui84bn.mongodb.net/blog"
  )
  .then(() => {
    console.log("DB connection established");
  })
  .catch((err) => console.log("DB connection error"));

app.use(express.json()); //дозволяє читати json які приходять з серверу

app.post("/auth/login", loginValidation, UserController.login);

app.post("/auth/registration", registerValidation, UserController.register);

app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/posts", checkAuth, postCreateValidation, PostController.create);

app.get("/posts", PostController.getAll);

app.get("/posts/:id", PostController.getOne);

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("server is running: ", PORT);
});
