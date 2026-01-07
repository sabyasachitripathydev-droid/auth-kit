import type {Request,Response, NextFunction } from "express";
import { AppError } from "../utils/error.js";
import { verifyToken } from "../utils/tokens.js";

export const authenticate = async (req:Request,res:Response,next:NextFunction) =>{
    try{
        const bearerToken = req.headers['authorization'];
        if(bearerToken === undefined) throw new AppError('authentication failed',401);
        const token = bearerToken.split(' ')[1];
        if(token === undefined || token === '') throw new AppError('authentication failed',401);
        const tokenData = verifyToken(token);
        if(tokenData.type != 'userloginaccess') throw new AppError('authentication failed',401);
        const user = {
            id:tokenData.id as number,
            email:tokenData.email as string
        };
        req.user= user;
        next();
    }catch(err){
        next(err);
    }    
}