import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EquipmentTypeEntity } from "../../equipment_types/entities/equipment_type.entity";
import { KnowledgeBaseEntity } from "../../knowledge_base/entities/knowledge_base.entity";

export enum IncomeType {
    GARANTIA = 'garantia',
    EXTERNO = 'externo'
}

export enum Status {
    PENDING = 'Pendiente',
    IN_PROGRESS = 'En progreso',
    COMPLETED = 'Completado',
}

@Entity('service_detail')
export class ServiceDetailEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: true })
    serial_number: string;

    @Column({ type: 'text', nullable: true })
    brand: string;

    @Column({ type: 'text', nullable: true })
    model: string;

    @Column()
    exit_date: Date;

    @Column()
    observations: string;

    @Column()
    reported_failure: string;

    @Column()
    technical_diagnosis: string;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.PENDING,
        nullable: true
    })
    status: string;

    @Column({
        type: 'enum',
        enum: IncomeType,
        default: IncomeType.EXTERNO,
        nullable: true
    })
    income_type: IncomeType;

    @ManyToOne(() => EquipmentTypeEntity, (equipmentType) => equipmentType.serviceDetails)
    @JoinColumn({ name: 'equipment_type_id' })
    equipment_type: EquipmentTypeEntity;

    @ManyToMany(() => KnowledgeBaseEntity, (knowledgeBase) => knowledgeBase.serviceDetails)
    @JoinTable({
        name: 'service_detail_knowledge_base', // Nombre de la tabla intermedia
        joinColumn: { name: 'service_detail_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'knowledge_base_id', referencedColumnName: 'id' }
    })
    knowledge_base: KnowledgeBaseEntity[];
}
