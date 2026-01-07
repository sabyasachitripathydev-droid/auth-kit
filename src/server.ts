import app from "./app.js";
import { env } from "./cofig/env.js";
import { sequelize } from "./database/db.js";
const initiateApp =async function(){
    try{
        await sequelize.authenticate();
        console.log("db connected successfully");
        app.listen(env.APP_PORT,()=>{
        console.log(`app is listening to ${env.APP_PORT}`);
    });
    }catch(err){
        console.log(`error while connecting to database: ${err}`);
        process.exit(1);
    }    
}
initiateApp();