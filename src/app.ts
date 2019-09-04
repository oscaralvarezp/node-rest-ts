// node_modules
import express, { Application } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';

// Import Routes
import indexRoutes from './routes/index.routes';
import postRoutes from './routes/post.routes';
import userRoutes from './routes/user.route';

class App {
    app: Application;

    constructor() {
        this.app = express();
        this.mongoConnection();
        this.settings();
        this.middlewares();
        this.routes();
    }

    private mongoConnection() {
        const mongo_uri = 'mongodb://localhost/rest-api-test'
        mongoose.connect(mongo_uri || process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        .then(db => console.log("DB is Connected"));
    }

    private settings() {
        this.app.set('port', process.env.PORT || 3000);
    }

    private middlewares() {
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(cors());
    }

    public routes() {
        this.app.use('/', indexRoutes);
        this.app.use('/api/posts', postRoutes);
        this.app.use('/api/users', userRoutes);
    }

    public server(): void {
         this.app.listen(this.app.get('port'), () => {
             console.log('Server start in: ', `http://localhost:${this.app.get('port')}`);
         });
    }
}

const app = new App();
app.server();