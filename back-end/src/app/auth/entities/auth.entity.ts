import { RolUsuario } from "src/utils/enums/RolUsuarios.enum";
import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

/**
 * Entidad de base de datos que representa a un usuario autenticado mediante Firebase.
 * Mapea los datos del usuario y su rol correspondiente en el sistema.
 */
@Entity()
export class Auth {

    /**
     * Identificador único del usuario, provisto por Firebase Auth. Actúa como llave primaria.
     */
    @PrimaryColumn()
    uidFirebase: string;

    /**
     * Nombre completo del usuario.
     */
    @Column()
    nombre: string;

    /**
     * Dirección de correo electrónico del usuario.
     */
    @Column()
    email: string;

    /**
     * Rol asignado al usuario dentro del sistema, mapeado mediante el enumerador RolUsuario.
     */
    @Column({ type: "enum", enum: RolUsuario })
    rol: RolUsuario;

    /**
     * Indica si la cuenta del usuario está activa o no.
     */
    @Column({ default: true })
    isActive: boolean
}
