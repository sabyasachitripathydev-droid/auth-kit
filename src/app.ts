import express from "express"
import helmet from "helmet";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import errorHandler from "./middlewares/errorHandler.js";
import logger from "./middlewares/logger.js";
import authRouter from "./routes/auth.route.js";
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(logger);
app.use('/user',userRouter);
app.use('/auth',authRouter)

app.use(errorHandler);
export default app;