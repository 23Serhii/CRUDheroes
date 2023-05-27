import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      required: true,
      type: String,
      unqie: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatarUrl: String,
  },
  {
    timestamps: true, // Схема автоматично при створенні нового користувача має автоматично зупинити створення та обновлення даної сутності
  }
);
export default mongoose.model("User", UserSchema);
