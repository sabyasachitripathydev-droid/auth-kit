import dotenv from "dotenv"
interface Env {
    DB_HOST:string;
    DB_PORT:string;
    DB_DATABASE:string;
    DB_USERNAME:string;
    DB_PASSWORD:string;
    APP_PORT:string;
    SMTP_USER:string;
    SMTP_PASSWORD:string;
    SMTP_HOST:string; 
    SMTP_PORT:string;
    TOKEN_SECRET:string;
    APP_EMAIL:string;
    APP_EMAIL_PASS:string;    
};
dotenv.config();
export const env:Env = {
        DB_HOST:process.env.DB_HOST || 'localhost',
        DB_PORT:process.env.DB_PORT || '3307',
        DB_DATABASE:process.env.DB_DATABASE || 'auth-kit',
        DB_USERNAME:process.env.DB_USERNAME || 'root',
        DB_PASSWORD:process.env.DB_PASSWORD || '',
        APP_PORT:process.env.APP_PORT || '',
        SMTP_USER:process.env.SMTP_USER || '',
        SMTP_PASSWORD:process.env.SMTP_PASSWORD || '',
        SMTP_HOST:process.env.SMTP_HOST || '',
        SMTP_PORT:process.env.SMTP_PORT || '',
        TOKEN_SECRET:process.env.TOKEN_SECRET || '',
        APP_EMAIL:process.env.APP_EMAIL || '',
        APP_EMAIL_PASS:process.env.APP_EMAIL_PASS || ''
};