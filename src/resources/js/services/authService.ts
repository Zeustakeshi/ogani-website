import api from "./api";

type RegisterPayload = {
    username: string;
    email: string;
    phone?: string;
    password: string;
    password_confirmation: string;
};

type RegisterResponse = {
    message: string;
    user: {
        email: string;
        username: string;
        phone: string | null;
        created_at: string;
    };
    token: string;
    token_type: string;
};

type LoginPayload = {
    email: string;
    password: string;
    remember?: boolean;
};

type LoginResponse = {
    message: string;
    user: {
        email: string;
        username: string;
        phone: string | null;
        created_at: string;
    };
    token: string;
    token_type: string;
};

const authService = {
    async register(data: RegisterPayload) {
        const response = await api.post<RegisterResponse>("/register", data);
        return response;

        return response;
    },

    async login(data: LoginPayload) {
        const response = await api.post<LoginResponse>("/login", data);

        return response;
    },
};

export default authService;