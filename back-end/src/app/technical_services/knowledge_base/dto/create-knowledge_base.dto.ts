import { IsNotEmpty, IsString } from "class-validator";

export class CreateKnowledgeBaseDto {
    @IsString()
    @IsNotEmpty()
    error_title: string;

    @IsString()
    @IsNotEmpty()
    symptoms: string;

    @IsString()
    @IsNotEmpty()
    root_cause: string;

    @IsString()
    @IsNotEmpty()
    solution: string;

    @IsString()
    @IsNotEmpty()
    keywords: string;

    @IsString()
    @IsNotEmpty()
    equipment_type: string;     


}
