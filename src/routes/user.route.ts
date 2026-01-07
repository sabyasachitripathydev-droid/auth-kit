import express from "express"
import { registerUserValidationRules } from "../validationRules/user.validation.js";
import validateRequest from "../middlewares/validate.js";
import { register } from "../controllers/user.controller.js";
const userRouter = express.Router();
userRouter.post('/register',registerUserValidationRules,validateRequest,register);
export default userRouter;