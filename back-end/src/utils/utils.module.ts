import { Module } from "@nestjs/common";
import { UtilsController } from "./utils.controller";

@Module({
    controllers: [UtilsController],
    providers: [],
    exports: [],
})
export class UtilsModule { }
