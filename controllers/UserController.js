import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import UserModel from "../models/User.js";
import bcrypt from "bcrypt";



export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    //шифрування пароля
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      
      passwordHash: hash,
    });
    //зберігання користувача в монгоДБ
    const user = await doc.save();

    // створили токен та він буде зберігати зашифровану інформацію. Ширфуєм тільки айді юзера, через те, що в токені є тільки айді. Після розшифровки, цієї інформації буде досить, щоб далі працювати і дізнаватись чи авторизований користувач чи ні і т.п.
    const token = jwt.sign({ _id: user._id }, "secret123", {
      expiresIn: "30d", // він перестає бути валідним через 30 днів
    });

    const { passwordHash, ...userData } = user._doc; // немає сенсу передавати юзеру хеш пароля. Ми витягли passwordHash за допомогою властивості деструктирізації і використаємо лише userData

    // повернення результату з сервера
    res.json({ ...userData, token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Не удалось зарегестрироваться. ",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден." });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPass) {
      return res.status(404).json({ message: "Неверный логин или пароль." });
    }

    const token = jwt.sign({ _id: user._id }, "secret123", {
      expiresIn: "30d",
    });
    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (err) {}
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "No access ",
    });
  }
};
