import type { User } from "../../types/user";
export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    user: { id: number; email: string; name?: string };
    token: string;
}