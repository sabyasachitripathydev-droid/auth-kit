import { body, query } from "express-validator";

export const loginValidationRules = [    
    body('email').exists({checkFalsy:true,checkNull:true}).withMessage('email is required')
    .isEmail().withMessage('email should be in proper format'),
    body('password').exists({checkFalsy:true,checkNull:true}).withMessage('password is required')
    .isLength({max:15,min:8}).withMessage('password should be from 8 to 15 characters')
];
export const verifyEmailValidationRule = [    
    query('token').exists()
    .withMessage('token is missing')
    .isString()
    .withMessage('token should be in string format')
];
export const logoutValidationRules = [    
    body('refresh_token').exists().withMessage('refresh token is missing')
    .isString().withMessage('refresh token should be a valid string')    
];
export const refreshLoginValidationRules = [    
    body('refresh_token').exists().withMessage('refresh token is missing')
    .isString().withMessage('refresh token should be a valid string')    
];
export const passwordResetRequestValidation = [    
    body('email').exists().withMessage('email is missing')
    .isEmail().withMessage('email should be a valid email')    
];
export const passworResetChangeValidationRules = [    
    body('old_password').exists().withMessage('old password is missing')
    .isString().withMessage('old password should be a valid string'),
    body('new_password').exists().withMessage('new password is missing')
    .isString().withMessage('new password should be a valid string')
    .isLength({max:15,min:8}).withMessage('new password should be from 8 to 15 characters'),
    body('reset_token').exists().withMessage('reset token is missing')
    .isString().withMessage('reset token should be a valid string'),   
];