import axios, { type AxiosResponse } from "axios"
import type { UserBack } from "../../utils/DataTypeBackEnd"

export const Auth = {
    async login(token: string) {
        try {
            const data: AxiosResponse<UserBack> = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log(data)
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