type IUser = {
    _id: string;
    name: string;
    username: string;
    email: string;
    is_verified: boolean;
    createdAt: string;
    updatedAt: string;
};

type IUserLoginResponse = {
    access_token: string;
    user: IUser;
};
