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
    datas?: any;
}

export default User;