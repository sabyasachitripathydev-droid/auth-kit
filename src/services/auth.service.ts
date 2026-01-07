import type { Transaction } from 'sequelize';
import * as db from '../database/db.js';
import { AppError } from '../utils/error.js';
import bcrypt from 'bcrypt'
import type { LoginActivityCreationAttributes } from '../database/models/login_activities.js';
import logger from '../utils/application-logging.js'
export const findRefreshToken = async function(userId:number|null = null,refreshToken:string,transaction:Transaction|null=null):Promise<db.RefreshToken>{
    const ownLogger = logger.child({methodName:"findRefreshToken",layer:"service",serviceName:"auth",userId});    
    try{
        let options:{where:{token:string;user_id?:number,revoked:boolean},transaction?:Transaction}={
            where:{
                token:refreshToken,
                revoked:false
            }
        };
        if(userId){
            options.where.user_id = userId;
        }
        if(transaction){
            options.transaction= transaction
        }        
        const refreshTokenData = await db.RefreshToken.findOne(options);
        if(!refreshTokenData) throw new AppError('unable to find refresh token data for the user',404);        
        ownLogger.info('refresh token found..');
        return refreshTokenData;
    }catch(err){
        ownLogger.error(err,'error finding refresh token');
        throw err;
    }
}
export const revokeRefreshToken = async function(tokenData:db.RefreshToken,transaction:Transaction):Promise<boolean>{
    const ownLogger = logger.child({methodName:"revokeRefreshToken",layer:"service",tokenId:tokenData.id});
    try{
        await tokenData.update({revoked:true},{transaction});
        ownLogger.info('refresh token revoked..')  
        return true; 
    }catch(err){
        ownLogger.error(err,'error revoking refresh token');
        throw err;
    }    
}
export const insertPassResetToken = async function(userId:number,hashedToken:string):Promise<boolean>{
    const ownLogger = logger.child({methodName:"insertPassResetToken",layer:"service",userId,tokenHash:hashedToken});
    try{        
        const expiryTime = new Date(Date.now() + (15 * 60 * 1000));        
        await db.PasswordResetToken.create({token:hashedToken,expires_at:expiryTime,user_id:userId});
        ownLogger.info({expiry:expiryTime},'pass reset token inserted');
        return true;
    }catch(err){
        ownLogger.error(err,'error inserting pass reset token');
        throw err;
    }
}
export const getPassResetToken = async function(hashedToken:string,transaction:Transaction):Promise<db.PasswordResetToken>{
    const ownLogger = logger.child({methodName:"getPassResetToken",layer:"service",tokenHash:hashedToken});
    try{                
        const passResetTokenData = await db.PasswordResetToken.findOne({
            where:{token:hashedToken},
            transaction
        });
        if(!passResetTokenData) throw new AppError('invalid password reset token',401);
        ownLogger.info({tokenId:passResetTokenData.id},'pass token data fetched');
        return passResetTokenData;
    }catch(err){
        ownLogger.error(err,'error getting pass reset token data');
        throw err;
    }
}
export const changeUserPassword = async function(userId:number,oldPass:string,newHashedPass:string,transaction:Transaction):Promise<boolean>{
    const ownLogger = logger.child({methodName:"changeUserPassword",layer:"service",userId});
    try{
        const user = await db.User.findOne({where:{id:userId},transaction});
        if(!user) throw new AppError('user not found',404);
        if(!await bcrypt.compare(oldPass,user.password_hash)) throw new AppError('incorrect current password',401);
        const [rowsAffected]= await db.User.update({password_hash:newHashedPass},{where:{id:userId},transaction});
        if(rowsAffected != 1) throw new AppError('invalid user or password',400);
        ownLogger.info('password changed...');
        return true;
    }catch(err){
        ownLogger.error(err,'error changing password');
        throw err;
    }
}
export const markPassResetTokenAsUsed = async function(passResetTokenData:db.PasswordResetToken,transaction:Transaction):Promise<boolean>{
    const ownLogger = logger.child({methodName:"markPassResetTokenAsUsed",layer:"service",passTokenId:passResetTokenData.id});
    try{
        await passResetTokenData.update({used:true},{transaction});
        ownLogger.info('token marked as used');
        return true;
    }catch(err){
        ownLogger.error(err,'error marking token as used');
        throw err;
    }
}
export const tranckLogin = async function (ip:string|undefined,userAgent:string|undefined,userId:number,transaction:Transaction):Promise<boolean>{
    const ownLogger = logger.child({methodName:"tranckLogin",layer:"service",userId});
    try{
        const ipAddress = ip !== undefined ? ip : null;
        const userAgentData = userAgent !== undefined ? userAgent : ''; 
        const loginActivityDataset:LoginActivityCreationAttributes = {
            user_id:userId,
            user_agent:userAgentData,
            ip_address:ipAddress
        };
        await db.LoginActivity.create(loginActivityDataset,{transaction}); 
        ownLogger.info('login tracked');       
        return true;
    }catch(err){
        ownLogger.error(err,'error tracking login');
        throw err;
    }
    
}