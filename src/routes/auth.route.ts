import express from "express"
import validateRequest from "../middlewares/validate.js";
import { login,logout,passwordResetChange,passwordResetRequest,refreshLogin,verifyEmail } from "../controllers/auth.controller.js";
import { loginValidationRules,logoutValidationRules,passwordResetRequestValidation,passworResetChangeValidationRules,refreshLoginValidationRules,verifyEmailValidationRule } from "../validationRules/auth.validation.js";
import { authenticate } from "../middlewares/authenticateUser.js";
const authRouter = express.Router();
authRouter.post('/login',loginValidationRules,validateRequest,login);
authRouter.post('/logout',logoutValidationRules,validateRequest,authenticate,logout);
authRouter.get('/verify-email',verifyEmailValidationRule,validateRequest,verifyEmail);
authRouter.post('/refresh-login',refreshLoginValidationRules,validateRequest,refreshLogin);
authRouter.post('/password-reset/request',passwordResetRequestValidation,validateRequest,passwordResetRequest);
authRouter.post('/password-reset/change',passworResetChangeValidationRules,validateRequest,passwordResetChange);
export default authRouter;