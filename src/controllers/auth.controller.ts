import type { NextFunction, Request, Response } from "express"
import bcrypt from 'bcrypt';
import { generateRefresToken, getUser, verifyUser } from "../services/user.service.js";
import { createPassResetTokens, createToken, decodeToken, verifyToken, type TokenData } from "../utils/tokens.js";
import { AppError } from "../utils/error.js";
import * as db from "../database/db.js";
import { changeUserPassword, findRefreshToken, getPassResetToken, insertPassResetToken, markPassResetTokenAsUsed, revokeRefreshToken, tranckLogin } from "../services/auth.service.js";
import type { LogoutBody, PasswordResetChangeBody, PasswordResetRequestBody, RefreshLoginBody } from "../dto/auth-controller.dto.js";
import { sendEmail } from "../utils/email.js";
import crypto from 'crypto';
export const login = async function(req:Request,res:Response,next:NextFunction){
    try{     
        const {email,password } = req.body; 
        const userData = await getUser(email);
        if(!userData) throw new AppError('user not found',404);
        const isPassCorrect = await bcrypt.compare(password,userData.password_hash);
        if(!isPassCorrect){
            throw new AppError("authentication failed",401);
        }
        const accessTokenData = {id:userData.id,email:userData.email,type:"userloginaccess"}
        const accessToken = createToken(accessTokenData);
        const refreshTokenData = {id:userData.id,email:userData.email,type:"userloginrefresh"}
        let refreshToken;
        await db.sequelize.transaction(async (t)=>{
            refreshToken = await generateRefresToken(refreshTokenData,t);
            await tranckLogin(req.ip,req.headers['user-agent'],userData.id,t);
        });        
        return res.status(200).json({
            error:false,
            message:"you are logged in successfully",
            data:{accessToken,refreshToken}
        });
    }catch(err){
        next(err);
    }
}
export const verifyEmail = async function(req:Request,res:Response,next:NextFunction){
    try{
        const token  = req.query.token as string;
        const tokenPayload = verifyToken(token);
        const email = tokenPayload.email;
        await db.sequelize.transaction(async (t)=>{
            const user =await getUser(email,t);
            if(!user) throw new AppError('user not found',404);
            await verifyUser(user,t);
            return res.status(200).json({
                error: false,
                message: 'user verified successfully'
            }); 
        });        
    }catch(err){
        next(err);
    }      
}
export const logout = async function(req:Request,res:Response,next:NextFunction){
    try{
        const input = req.body as LogoutBody;
        const userId = req.user?.id as number;
        const refreshToken = input.refresh_token;
        db.sequelize.transaction(async(t)=>{
        const refreshTokenData = await findRefreshToken(userId,refreshToken,t);
        await revokeRefreshToken(refreshTokenData,t); 
        });
        return res.status(200).json({
            error:false,
            message:'you are logged out successfully'
        });
    }catch(err){
        next(err);
    }    
}
export const refreshLogin = async function(req:Request,res:Response,next:NextFunction){
    try{
        const input = req.body as RefreshLoginBody;
        const tokenData = verifyToken(input.refresh_token);        
        const userId = tokenData.id as number;
        const tokenType = tokenData.type as string;
        const tokenEmail = tokenData.email as string;
        if(tokenType !== 'userloginrefresh') throw new AppError('invalid token',401);
        const userData = await getUser(tokenEmail,null,userId);
        if(!userData) throw new AppError('user not found',404);
        const accessTokenData:TokenData = {
            id:userId,
            email:tokenEmail,
            type:'userloginaccess'
        }
        const accessToken = createToken(accessTokenData);
        const refreshTokenData = {
            id:userId,
            email:tokenEmail,
            type:'userloginrefresh'
        }        
        //revoke the old refresh token
        let refreshToken;
        await db.sequelize.transaction(async (t)=>{            
            const oldRefreshTokenData = await findRefreshToken(userId,input.refresh_token,t);
            await revokeRefreshToken(oldRefreshTokenData,t);
            refreshToken = await generateRefresToken(refreshTokenData,t);            
        });
        return res.status(200).json({
            error:false,
            message:'token refreshed successfully!',
            data:{accessToken,refreshToken}
        });
    }catch(err){
        next(err);
    }    
}
export const passwordResetRequest = async function(req:Request,res:Response,next:NextFunction){
    try{
        const input = req.body as PasswordResetRequestBody;
        const user = await getUser(input.email);
        if(!user) throw new AppError('user not found',404);
        const passResetTokens = createPassResetTokens();
        await insertPassResetToken(user.id,passResetTokens.hashedToken);
        const subject = 'Reset Password';
        const link = new URL(`/auth/change-password/${passResetTokens.rawToken}`,'http://localhost:3000');
        const html = `<h1>Reset Password</h1>
        <p>kindly click on the link below to reset password</p>
        <a href="${link}">click here</a>
        `;
        await sendEmail(subject,user.email,html);
        return res.status(200).json({
            error:false,
            message:'an email is sent with the link to reset your password'
        });   
    }catch(err){
        next(err);
    }    
}
export const passwordResetChange = async function(req:Request,res:Response,next:NextFunction){
    try{
        const input = req.body as PasswordResetChangeBody;
        const hashedToken = crypto.createHash('sha256').update(input.reset_token).digest('hex');        
        const hashedNewPassword = await bcrypt.hash(input.new_password,10);
        if(input.old_password === input.new_password) throw new AppError('your old password cannot be your new password',401);
        await db.sequelize.transaction(async function(t){
            const passResetTokenData = await getPassResetToken(hashedToken,t);        
            if(passResetTokenData.expires_at < new Date()) throw new AppError('your reset token is expired',401);            
            await changeUserPassword(passResetTokenData.user_id,input.old_password,hashedNewPassword,t);
            await markPassResetTokenAsUsed(passResetTokenData,t);
        });
        return res.status(200).json({
            error:false,
            message:'your password was updated successfully!'
        });        
    }catch(err){
        next(err);
    }
}