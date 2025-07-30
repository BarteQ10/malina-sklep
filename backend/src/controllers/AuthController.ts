import { Controller, Route, Post, Body, Tags } from 'tsoa';
import { prisma } from '../prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HttpError } from '../utils/errors';
import { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth';
import { isValidEmail, isValidPassword, isValidName } from '../utils/validators';


@Route('auth')
@Tags('Auth')
export class AuthController extends Controller {
    @Post('register')
    public async register(@Body() body: RegisterRequest): Promise<{ message: string }> {
        const { email, password, name } = body;
        if (!email || !password) {
            throw new HttpError(400, 'Email and password are required');
        }
        if (!isValidEmail(email)) throw new HttpError(400, 'Invalid email format');
        if (!isValidPassword(password)) {
            throw new HttpError(400, 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character');
        }
        if (name && !isValidName(name)) throw new HttpError(400, 'Name must be between 2 and 50 characters');

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) throw new HttpError(400, 'User already exists');

        const hashed = await bcrypt.hash(password, 10);
        await prisma.user.create({ data: { email, password: hashed, name } });

        return { message: 'User created' };
    }

    @Post('login')
    public async login(@Body() body: LoginRequest): Promise<AuthResponse> {
        const { email, password } = body;

        if (!isValidEmail(email)) throw new HttpError(400, 'Invalid email format');
        if (!password) throw new HttpError(400, 'Password is required');

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new HttpError(401, 'Invalid credentials');
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name ?? undefined,
            },
        };
    }
}
