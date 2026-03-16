import { signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence, type User } from 'firebase/auth'
import { auth } from './config'

export const FirebaseApi = {
    async login(email: string, password: string): Promise<User | null> {
        try {
            // ensure persistence is set to local (survives page reload)
            await setPersistence(auth, browserLocalPersistence)
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            return userCredential.user
        } catch (error) {
            return null
        }
    },

    async logout(): Promise<void> {
        try {
            await signOut(auth)
        } catch (error) {
            console.log(error)
        }
    },

    // expose onAuthStateChanged for consumers that want to subscribe
    // callback receives a Firebase `User | null` (consumers will map to backend user)
    onAuthStateChanged: (cb: (user: User | null) => void) => onAuthStateChanged(auth, cb),

    // init persistence explicitly (useful at app start)
    async initPersistence(): Promise<void> {
        try {
            await setPersistence(auth, browserLocalPersistence)
        } catch (e) {
            console.log('Failed to set persistence', e)
        }
    },
}

