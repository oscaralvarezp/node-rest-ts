import { Request, Response, Router } from 'express';
import Post from '../models/Post';

class PostRoutes {

    router: Router;
    
    constructor() {
        this.router = Router();
        this.routes();
    }

    // Methods of the API
    public async getPosts(req: Request, res: Response): Promise<void> {
        const posts = await Post.find();
        res.json(posts);
    }

    public async getPost(req: Request, res: Response): Promise<void> {
        const { url } = req.params;
        const post = await Post.findOne({url: url});
        res.json(post);
    }
    
    public async createPost(req: Request, res: Response): Promise<void> {
        const {title, url, content, image } = req.body;
        const newpost = new Post({ title, url, content, image });
        await newpost.save();
        res.json({
            messge: 'Post created successfully',
            data: newpost
        }); 
    }

    public async updatePost(req: Request, res: Response): Promise<void> {
        const { url } = req.params;
        const post = await Post.findOneAndUpdate({url}, req.body, { new:true });
        res.json({
            message: 'Post updated successfully',
            data: post
        });
    }

    public async deletePost(req: Request, res: Response): Promise<void> {
        const { url } = req.params;
        const post = await Post.findOneAndDelete({url});
        res.json({
            message: 'Post deleted successfully',
            data: post
        })
    }
    // Routes of the Api
    public routes () {
        this.router.route('/')
            .get(this.getPosts)
            .post(this.createPost);
        this.router.route('/:url')
            .get(this.getPost)
            .put(this.updatePost)
            .delete(this.deletePost);
    }

}

const postRoutes = new PostRoutes();
export default postRoutes.router;