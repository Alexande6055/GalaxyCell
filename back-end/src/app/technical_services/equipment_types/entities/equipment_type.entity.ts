import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ServiceOrderEntity } from "../../service_orders/entities/service_order.entity";
import { ServiceDetailEntity } from "../../service_details/entities/service_detail.entity";
import { KnowledgeBaseEntity } from "../../knowledge_base/entities/knowledge_base.entity";

@Entity('equipment_type')
export class EquipmentTypeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToMany(() => ServiceDetailEntity, (serviceDetail) => serviceDetail.equipment_type)
    serviceDetails: ServiceDetailEntity[];

    @OneToMany(() => KnowledgeBaseEntity, (knowledgeBase) => knowledgeBase.equipment_type)
    knowledgeBases: KnowledgeBaseEntity[];

}
