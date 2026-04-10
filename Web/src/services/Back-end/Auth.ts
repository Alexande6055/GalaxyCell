import type { UserBack } from "../../utils/DataTypeBackEnd";
import apiClient from "../utils/apiClient";

export const Auth = {
    async login(): Promise<UserBack | undefined> {
        // El token ya se envía solo gracias al interceptor
        const { data } = await apiClient.get<UserBack>("/auth");
        return data;
    },

    async listUserTech(): Promise<UserBack[] | undefined> {
        const { data } = await apiClient.get<UserBack[]>("/auth/list-user-tech");
        return data;
    },

    async updateUserTech(updateUser: {
        email: string;
        nombre: string;
        password: string | null;
    }): Promise<UserBack | undefined> {
        const { data } = await apiClient.patch<UserBack>("/auth/update-user-tech", updateUser);
        return data;
    },

    async createUserTech(createUser: {
        email: string;
        nombre: string;
        password: string;
    }): Promise<UserBack | undefined> {
        const { data } = await apiClient.post<UserBack>("/auth/create-user-tech", createUser)
        return data;
    }
};