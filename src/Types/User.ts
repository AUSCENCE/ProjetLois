interface User {
    id?: number;
    name: string;
    email: string;
    password?: string
    role?: string;
    bio?: string;
    phone?: string;
    country?: string;
    city?: string;
    avatar?: string;
}

export default User;