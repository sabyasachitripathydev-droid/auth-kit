import type { Request,Response, NextFunction } from "express"
import { AppError } from "../utils/error.js";
const errorHandler = function (err:Error|AppError,req:Request,res:Response,next:NextFunction){
    if(err instanceof AppError){
        return res.status(err.statusCode).json({
            error:true,
            message:err.message,
            details:err
        });
    }
    return res.status(500).json({
        error:true,
        message:"internal server error",
        details:err
    });
} 
export default errorHandler;