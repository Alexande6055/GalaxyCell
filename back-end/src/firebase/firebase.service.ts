import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
    private credential = {
        type: process.env.FIREBASE_ADMIN_TYPE,
        project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
        private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n') : "",
        client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
        auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
        token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
        universe_domain: process.env.FIREBASE_ADMIN_UNIVERSE_DOMAIN
    }
    constructor() {
        if (!this.credential.private_key || !this.credential.client_email) {
            throw new Error('Firebase credentials are incomplete or invalid');
        }
        this.initializeFirebase();
    }
    private initializeFirebase() {
        if (!admin.apps.length) {
            if (!this.credential) {
                throw new Error('FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON environment variable is not defined');
            }
            const serviceAccountData = JSON.parse(JSON.stringify(this.credential)) as admin.ServiceAccount;
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccountData),
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET
            });
        }
    }

    /**
     * OTHER FUNCTIONS WITH THE FIREBASE CONSOLE SUCH AS TOKEN VALIDATION
     */
    async verifyIdToken(idToken: string) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            return decodedToken;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    /**Function for created User with Email and Password method */
    async createUserWithEmail(email: string, password: string, displayName?: string) {
        try {
            const userRecord = await admin.auth().createUser({
                email,
                password,
                displayName,
                emailVerified: false,
                disabled: false,
            });

            return {
                uid: userRecord.uid,
                email: userRecord.email,
                displayName: userRecord.displayName,
            };

        } catch (error: any) {
            if (error.code === 'auth/email-already-exists') {
                throw new BadRequestException('El correo ya está registrado');
            }

            if (error.code === 'auth/invalid-password') {
                throw new BadRequestException('La contraseña debe tener al menos 6 caracteres');
            }
            if (error.code === 'auth/invalid-email') {
                throw new BadRequestException('El correo ingresado no es un correo valido');
            }

            throw new InternalServerErrorException('Error creando usuario');
        }
    }


}