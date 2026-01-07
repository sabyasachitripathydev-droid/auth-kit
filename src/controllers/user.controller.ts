import type { NextFunction, Request, Response } from "express"
import bcrypt from 'bcrypt';
import type { UserCreationAttributes } from "../database/models/users.js";
import { createUserAndSendEmailVerification } from "../services/user.service.js";
import type { RegisterBody } from "../dto/user-controller.dto.js";
export const register = async function(req:Request,res:Response,next:NextFunction){
    try{     
        const {email, name, password } = req.body as RegisterBody;
        const hashedPassword = await bcrypt.hash(password,10);
        const userData:UserCreationAttributes = {
            name:name || "",
            email:email || "",
            password_hash:hashedPassword,
            role:'user'
        };
        const newUser = await createUserAndSendEmailVerification(userData);
        return res.status(201).json({
            error:false,
            message:"user created successfully",
            data:newUser
        });
    }catch(err){        
        next(err);
    }
}