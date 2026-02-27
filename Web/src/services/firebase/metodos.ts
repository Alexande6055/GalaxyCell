import { signInWithEmailAndPassword, type User } from "firebase/auth";
import { auth } from "./config";

export const FirebaseApi = {
    async login(email: string, password: string): Promise<User | null> {
        return signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                return user;
            })
            .catch((error) => {
               // const errorCode = error.code;
                //const errorMessage = error.message;
                return null;
            });
    }
}