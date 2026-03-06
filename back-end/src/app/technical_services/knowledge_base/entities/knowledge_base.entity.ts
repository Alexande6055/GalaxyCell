import { Column, Entity, ManyToMany, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { EquipmentTypeEntity } from "../../equipment_types/entities/equipment_type.entity";
import { ServiceDetailEntity } from "../../service_details/entities/service_detail.entity";

@Entity('knowledge_base')
export class KnowledgeBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    error_title: string;

    @Column()
    symptoms: string;

    @Column()
    root_cause: string;

    @Column()
    solution: string;

    @Column()
    keywords: string;

    @ManyToOne(() => EquipmentTypeEntity, (equipmentType) => equipmentType.knowledgeBases)
    @JoinColumn({ name: 'equipment_type_id' })
    equipment_type: EquipmentTypeEntity;

    @ManyToMany(() => ServiceDetailEntity, (serviceDetail) => serviceDetail.knowledge_base)
    serviceDetails: ServiceDetailEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

}