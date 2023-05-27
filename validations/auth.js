import { body } from "express-validator";

export const registerValidation = [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  body("fullName").isLength({ min: 3 }),
  body("avatarUrl").optional().isURL(), // optional на вибір. Якщо користувач додасть аватар, то буде провіряти чи це є посиалнням. Якщо не відправить - нічого страшного
];
export const loginValidation = [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
];
