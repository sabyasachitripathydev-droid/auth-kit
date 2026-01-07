import type { UserAttributes, UserCreationAttributes } from "../database/models/users.js";
import { RefreshToken, sequelize, User } from "../database/db.js"
import { Sequelize, type Transaction } from "sequelize";
import { createToken, decodeToken, type TokenData } from "../utils/tokens.js";
import { sendEmail } from "../utils/email.js";
import type { RefreshTokenAttributes, RefreshTokenCreationAttributes } from "../database/models/refresh_tokens.js";
import { AppError } from "../utils/error.js";
import * as db from '../database/db.js';
import logger from '../utils/application-logging.js'
export const createUserAndSendEmailVerification = async function(userData:UserCreationAttributes){
  const ownLogger = logger.child({methodName:"createUserAndSendEmailVerification",layer:"service",serviceName:"user"});      
  const t = await sequelize.transaction();
  try{
    const existingUser = await getUser(userData.email);
    if(existingUser) throw new AppError('user already exists with given email',409);
    const newUser =await createUser(userData,t);    
    await sendEmailVerification(newUser);    
    await t.commit();
    ownLogger.info('user created and email verification sent...');
    return newUser; 
  }catch(err){
    await t.rollback();
    ownLogger.error(err,'unable to create user and send email verification');
    throw err
  }
};
const createUser = async function(userData:UserCreationAttributes,transaction:Transaction){
  const ownLogger = logger.child({methodName:"createUser",layer:"service",serviceName:"user"});
  const newUser = await User.create(userData,{transaction});
  ownLogger.info({userId:newUser.id},'user created...');
  return newUser;
}
const sendEmailVerification = async function(userData:UserAttributes){
    const ownLogger = logger.child({methodName:"sendEmailVerification",layer:"service",serviceName:"user"});
    try{
        const tokenData={id:userData.id,email:userData.email,type:'emailverification'} 
        const token = createToken(tokenData);
        const subject = "Authkit email verification";
        const verificationLink = new URL('/auth/verify-email','http://localhost:3000');
        verificationLink.searchParams.append('token',token);
        const html = `<h1>Email Verification</h1>
        <p>kindly click on the link below to verify your email</p>
        <a href="${verificationLink}">click here</a>
        `;
        await sendEmail(subject,userData.email,html);
        ownLogger.info('email verification sent...');
        return true;
    }catch(err){
      ownLogger.error(err,'error sending email verification...');
      throw new Error('unable to send email:'+err);
    }    
}
export const getUser = async function(email:string,transaction:Transaction|null=null,userId:number|null=null):Promise<db.User|null>{
  const ownLogger = logger.child({methodName:"getUser",layer:"service",serviceName:"user"});
  try{
    let options:{where:{email:string;id?:number},transaction?:Transaction}={where:{email}};
    if(transaction){
      options.transaction = transaction;
    }
    if(userId){
      options.where.id = userId;
    }    
    const userData = await User.findOne(options);    
    ownLogger.info('user fetched...');
    return userData;
  }catch(err){
    ownLogger.error(err,'unable to get user...');
    throw err;
  }
}
export const verifyUser = async (user:db.User,t:Transaction)=>{
  const ownLogger = logger.child({methodName:"verifyUser",layer:"service",serviceName:"user"});
  try{
    await user.update({is_verified:true},{transaction:t});
    ownLogger.info('user verified...');
    return true;
  }catch(err){
    ownLogger.error(err,'unable to verify user');
    throw err;
  }  
}
export const generateRefresToken= async function(payload:TokenData,transaction:Transaction | null = null):Promise<string>{
  const ownLogger = logger.child({methodName:"verifyUser",layer:"service",serviceName:"user"});  
  try{    
    const refreshToken = createToken(payload);
    const expiryTimeInSeconds = decodeToken(refreshToken).exp;
    const expiryTime = new Date(expiryTimeInSeconds! * 1000);
    const refreshTokenTablePayload:RefreshTokenCreationAttributes = {
      user_id:payload.id,
      token:refreshToken,
      expires_at: expiryTime
    }    
    await RefreshToken.create(refreshTokenTablePayload,{transaction});
    ownLogger.info('token generated...')   
    return refreshToken;
  }catch(err){    
    ownLogger.error(err,'unable to generate token...');
    throw new Error('unable to generate refresh token');
  }
}