import morgan from "morgan";
import path from "path";
import * as rfs from "rotating-file-stream"
const stream = rfs.createStream('access.log',{
    interval:"1d",
    path: path.join(process.cwd(),"logs")
});
const logger = morgan("combined",{stream});
export default logger;