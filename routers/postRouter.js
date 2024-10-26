import { Router } from 'express';
import { getPosts, createPost, getPostById,  updatePost, deletePost } from '../controllers/posts.js';

const postRouter = Router();

postRouter.get('/', getPosts);
postRouter.post('/', createPost);
postRouter.get('/:id', getPostById);
postRouter.put('/:id', updatePost);
postRouter.delete('/:id', deletePost);

export default postRouter;