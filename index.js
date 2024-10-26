import express from 'express';
import cors from 'cors';
import postRouter from './routers/postRouter.js';

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use('/posts', postRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});