import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './routes/routes';
import * as swaggerJson from './swagger.json';
import { Request, Response, NextFunction } from 'express';
import { HttpError } from './utils/errors';
import path from 'path';


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));

// Register tsoa routes
RegisterRoutes(app);

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ error: message });
});



export default app;
