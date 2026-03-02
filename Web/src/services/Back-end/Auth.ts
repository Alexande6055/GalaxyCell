import axios, { type AxiosResponse } from "axios"
import type { UserBack } from "../../utils/DataTypeBackEnd"
import { auth } from "../firebase/config";

export const Auth = {

    async login(token: string) {
        try {
            const data: AxiosResponse<UserBack> = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (data.data)
                return data.data
            return undefined;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error fetching users:', error.message);
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }

    },
    async listUserTech(): Promise<UserBack[] | undefined> {
        try {
            const user = auth.currentUser

            if (!user) {
                throw new Error("No authenticated user")
            }

            // true = fuerza refresh del token
            const token = await user.getIdToken(true)

            const data: AxiosResponse<UserBack[]> = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/list-user-tech`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (data.data)
                return data.data
            return undefined;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Error fetching users:', error.message);
            } else {
                console.error('An unexpected error occurred:', error);
            }
        }
    }
}