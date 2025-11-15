import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { body } from "express-validator";
import { validationResult } from "express-validator";

const router = Router();

// validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Email must be a valid email address"),

    body("password")    
      .isLength({ min: 3 })
      .withMessage("Password must be at least 3 characters long"),
  ],
  validate,                // <<--- Yeh bahut important hai
  userController.createUserController
);

export default router;
