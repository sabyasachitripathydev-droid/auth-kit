import nodemailer from "nodemailer"
import { env } from "../cofig/env.js";
const transport = nodemailer.createTransport({
    host:env.SMTP_HOST,
    port:Number(env.SMTP_PORT),
    secure:true,
    auth:{
        user:env.APP_EMAIL,
        pass:env.APP_EMAIL_PASS
    },
    tls:{
        rejectUnauthorized:false
    }
});

export const sendEmail =async function(subject:string,to:string,html:string){
    try{        
        const from  = `"Authkit" <${env.SMTP_USER}>`;
        await transport.sendMail({
            to,from,html,subject
        });
        return true;
    }catch(err){
        throw new Error(`error occurred while sending the email: ${err}`);
    }
}