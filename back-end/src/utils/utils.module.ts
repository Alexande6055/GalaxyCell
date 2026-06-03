import { Module } from "@nestjs/common";
import { UtilsController } from "./utils.controller";

/**
 * Módulo de NestJS que agrupa utilidades y controladores genéricos de la aplicación.
 * Registra el controlador UtilsController.
 */
@Module({
    controllers: [UtilsController],
    providers: [],
    exports: [],
})
export class UtilsModule { }
