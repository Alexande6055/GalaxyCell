import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import * as admin from 'firebase-admin';

/**
 * Servicio de integración con Firebase Admin SDK.
 * Proporciona métodos para inicializar la conexión, verificar tokens JWT y gestionar usuarios (crear, actualizar, deshabilitar).
 */
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

    /**
     * Valida que las variables de entorno de Firebase estén completas y llama a la inicialización.
     */
    constructor() {
        if (!this.credential.private_key || !this.credential.client_email) {
            throw new Error('Firebase credentials are incomplete or invalid');
        }
        this.initializeFirebase();
    }

    /**
     * Inicializa la app de Firebase Admin si no ha sido inicializada previamente.
     */
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
     * Verifica la validez de un token ID JWT enviado por el cliente.
     * 
     * @param idToken - Token JWT a verificar.
     * @returns Los datos decodificados del token si es válido.
     * @throws {UnauthorizedException} Si el token es inválido o ha expirado.
     */
    async verifyIdToken(idToken: string) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            return decodedToken;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    /**
     * Registra un nuevo usuario en Firebase Authentication con email y contraseña.
     * 
     * @param email - Correo del nuevo usuario.
     * @param password - Contraseña de acceso.
     * @param displayName - Nombre descriptivo del usuario.
     * @returns Un objeto con el uid, email y displayName asignados por Firebase.
     * @throws {InternalServerErrorException} Si ocurre un error no controlado de Firebase.
     */
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
            catchErrorFirebase(error)

            throw new InternalServerErrorException('Error creando usuario');
        }
    }

    /**
     * Actualiza la contraseña de un usuario en Firebase Authentication.
     * 
     * @param uid - Identificador único de Firebase del usuario.
     * @param newPassword - Nueva contraseña.
     * @returns Un objeto con los detalles de actualización del usuario.
     * @throws {InternalServerErrorException} Si ocurre un error no controlado de Firebase.
     */
    async updatePasswordUser(uid: string, newPassword: string) {
        try {
            const userRecord = await admin.auth().updateUser(uid, {
                password: newPassword,
            });

            return {
                uid: userRecord.uid,
                email: userRecord.email,
                message: 'Contraseña actualizada correctamente'
            };

        } catch (error: any) {

            catchErrorFirebase(error)

            throw new InternalServerErrorException('Error actualizando la contraseña');
        }
    }

    /**
     * Deshabilita (bloquea) la cuenta de un usuario en Firebase Authentication.
     * 
     * @param uid - Identificador único del usuario.
     * @returns Mensaje de confirmación.
     * @throws {InternalServerErrorException} Si ocurre un error no controlado.
     */
    async disableUser(uid: string) {
        try {
            const userRecord = await admin.auth().updateUser(uid, {
                disabled: true,
            });

            return {
                message: 'Usuario deshabilitado correctamente'
            };

        } catch (error: any) {

            catchErrorFirebase(error)

            throw new InternalServerErrorException('Error deshabilitando el usuario');
        }
    }

}

/**
 * Función auxiliar para capturar códigos de error de Firebase Authentication
 * y mapearlos a excepciones estándar de NestJS con mensajes claros en español.
 * 
 * @param error - El objeto de error retornado por Firebase.
 * @throws {BadRequestException} Con el mensaje correspondiente al error de Firebase.
 */
function catchErrorFirebase(error: any) {
    if (error.code === 'auth/email-already-exists') {
        throw new BadRequestException('El correo ya está registrado');
    }

    if (error.code === 'auth/invalid-password') {
        throw new BadRequestException('La contraseña debe tener al menos 6 caracteres');
    }
    if (error.code === 'auth/invalid-email') {
        throw new BadRequestException('El correo ingresado no es un correo valido');
    }
    if (error.code === 'auth/user-not-found') {
        throw new BadRequestException('Usuario no encontrado');
    }


}