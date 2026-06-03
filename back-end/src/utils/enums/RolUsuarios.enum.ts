/**
 * Enumerador que define los roles de usuario permitidos dentro del sistema GalaxyCell.
 */
export enum RolUsuario {
    /** Rol con privilegios administrativos totales. */
    ADMIN = 'admin',
    /** Rol asignado al personal de soporte técnico. */
    TECNICO = 'tecnico',
    /** Rol asignado a los clientes de la tienda. */
    CLIENTE = 'cliente',
}