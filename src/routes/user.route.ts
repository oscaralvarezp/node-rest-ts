import { Request, Response, Router } from 'express';
import User from '../models/User';

class UserRoutes {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    // Methods of the API
    public async getUsers(req: Request, res: Response): Promise<void> {
        const users = await User.find();
        res.json(users);
    }

    public async getUser(req: Request, res: Response): Promise<void> {
        const { username } = req.params;
        const user = await User.findOne({ username: username }).populate('posts', 'title content -_id');
        res.json(user);
    }

    public async createUser(req: Request, res: Response): Promise<void> {
        const newuser = new User(req.body);
        await newuser.save();
        res.json({
            messge: 'User created successfully',
            data: newuser
        });
    }

    public async updateUser(req: Request, res: Response): Promise<void> {
        const { username } = req.params;
        const user = await User.findOneAndUpdate({ username }, req.body, { new: true });
        res.json({
            message: 'User updated successfully',
            data: user
        });
    }

    public async deleteUser(req: Request, res: Response): Promise<void> {
        const { username } = req.params;
        const user = await User.findOneAndDelete({ username });
        res.json({
            message: 'User deleted successfully',
            data: user
        })
    }
    // Routes of the Api
    public routes() {
        this.router.route('/')
            .get(this.getUsers)
            .post(this.createUser);
        this.router.route('/:username')
            .get(this.getUser)
            .put(this.updateUser)
            .delete(this.deleteUser);
    }

}

const userRoutes = new UserRoutes();
export default userRoutes.router;