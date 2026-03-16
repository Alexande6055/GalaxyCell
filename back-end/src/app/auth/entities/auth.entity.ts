import { RolUsuario } from "src/utils/enums/RolUsuarios.enum";
import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Auth {

    @PrimaryColumn()
    uidFirebase: string;

    @Column()
    nombre: string;

    @Column()
    email: string;

    @Column({ type: "enum", enum: RolUsuario })
    rol: RolUsuario;

    @Column({ default: true })
    isActive: boolean




}
