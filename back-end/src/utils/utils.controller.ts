import { Controller, Get } from "@nestjs/common";
import { RolUsuario } from "./enums/RolUsuarios.enum";
import { Public } from "src/decorators/public.decorator";
/**
 * Controlador para endpoints de utilidad y configuraciones generales expuestas al cliente.
 */
@Controller('utils')
export class UtilsController {

    /**
     * Endpoint público que devuelve los roles de usuario configurados en el sistema.
     * Mapea el enumerador RolUsuario a un arreglo de objetos conteniendo el código y el nombre amigable de cada rol.
     * RUTA: GET /utils/roles
     * 
     * @returns Un arreglo con los roles de usuario { codigo, nombre }.
     */
    @Public()
    @Get('roles')
    obtenerTipoUsuario() {
        return Object.entries(RolUsuario).map(([codigo, nombre]) => ({ codigo, nombre }))
    }

}
