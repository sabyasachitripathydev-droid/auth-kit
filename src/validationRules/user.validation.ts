import { body } from "express-validator";

export const registerUserValidationRules = [
    body('name').exists({checkFalsy:true,checkNull:true}).withMessage('name is required')
    .isLength({min:4}).withMessage('name should be of at least 4 characters'),
    body('email').exists({checkFalsy:true,checkNull:true}).withMessage('email is required')
    .isEmail().withMessage('email should be in proper format'),
    body('password').exists({checkFalsy:true,checkNull:true}).withMessage('password is required')
    .isLength({max:15,min:8}).withMessage('password should be from 8 to 15 characters')
];