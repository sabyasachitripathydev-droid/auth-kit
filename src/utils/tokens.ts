import jwt, { type JwtPayload } from 'jsonwebtoken'
import { AppError } from './error.js';
import crypto from 'crypto';
import { env } from '../cofig/env.js';
export interface TokenData {
    id:number;
    email:string;
    type:string;
}
export const createToken = function(data:TokenData){
    try{
        const expiresIn = (data.type == 'emailverification')?'15m':((data.type == 'userloginaccess')?'1h':((data.type == 'userloginrefresh')?'7d':'4h'));
        const token = jwt.sign(data,env.TOKEN_SECRET,{
            expiresIn:expiresIn
        });
    return token;
    }catch(err){
        throw new Error(`unable to generate new token`);
    }    
}
export const decodeToken = function(token:string):jwt.JwtPayload{
    try{
        const decodedData = jwt.decode(token);
        if(!decodedData) throw new Error('error decoding refresh token');
        if(typeof decodedData == 'string') throw new AppError('invalid token',401);
        return decodedData;
    }catch(err){
        throw err;
    }    
}
export const verifyToken = function(token:string):JwtPayload{
    try{
        const payload = jwt.verify(token,env.TOKEN_SECRET);
        if(typeof payload == 'string'){
            throw new AppError('invalid token data',401);
        }
        return payload;
    }catch(err:any){
        if(err instanceof AppError){
            throw err;
        }else{
            if(err.name == 'TokenExpiredError'){
                throw new AppError('token expired',401);
            }else if(err.name == 'JsonWebTokenError'){
                throw new AppError('invalid token',401);
            }else{
                throw new AppError('authentication failed',401);
            }
        }
    }     
}
export const createPassResetTokens = function():{rawToken:string,hashedToken:string}{
    try{
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
        return {rawToken,hashedToken};
    }catch(err){
        throw err;
    }
}