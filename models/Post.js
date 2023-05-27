import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      required: true,
      type: String,
      unqie: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    imageUrl: String,

    timestamps: true, // Схема автоматично при створенні нового користувача має автоматично зупинити створення та обновлення даної сутності
  }
);
const PostModel = mongoose.model("Post", PostSchema);
export default PostModel;
