import pino from "pino";
//pino transport object
const fileTransport = pino.transport({
    target:'pino/file',
    options:{
        destination:process.cwd()+'/logs/application/app.log'
    }
});
//pino object with options
export default pino(
    {        
        //minimum log level
        level:'info',
        //defining custom levels
        customLevels:{
            notice:35
        },
        //formatter for formatting keys like level, bindings(pid,host etc)
        formatters:{
            level:(label,number)=>{
                return {level:label,levelNum:number};
            },
            bindings:(binding)=>{
                return {pid:binding.pid,host:binding.hostname,nodeversion:process.version};
            }
        },
        //timestamp optimization
        timestamp:pino.stdTimeFunctions.isoTime
    },
    //transport object usage
    fileTransport
);