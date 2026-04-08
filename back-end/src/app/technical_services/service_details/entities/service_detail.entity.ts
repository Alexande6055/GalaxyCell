import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EquipmentTypeEntity } from "../../equipment_types/entities/equipment_type.entity";
import { KnowledgeBaseEntity } from "../../knowledge_base/entities/knowledge_base.entity";
import { ServiceOrderEntity } from "../../service_orders/entities/service_order.entity";

export enum StateType {
    PENDING = 'Pendiente',
    IN_PROGRESS = 'En proceso',
    COMPLETED = 'Completado',
    CANCELLED = 'Cancelado',
}

@Entity('service_detail')
export class ServiceDetailEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', nullable: true })
    serial_number: string;

    @Column({ type: 'text', nullable: true })
    brand: string | null;

    @Column({ type: 'text', nullable: true })
    model: string | null;

    @Column({
        type: "date",
        nullable: true,
        default: null
    })
    exit_date: Date | null;

    @Column({
        type: 'text',
        nullable: true,
        default: null
    })
    observations: string | null;

    @Column({ type: 'text' })
    reported_failure: string;

    @Column({
        type: 'text',
        nullable: true,
        default: null
    })
    technical_diagnosis: string | null;

    @Column({
        type: 'enum',
        enum: StateType,
        default: StateType.PENDING,
        nullable: true
    })
    status: StateType;

    @ManyToOne(() => ServiceOrderEntity, (serviceOrder) => serviceOrder.serviceDetails)
    @JoinColumn({ name: 'service_order_id' })
    serviceOrder: ServiceOrderEntity;

    @ManyToOne(() => EquipmentTypeEntity, (equipmentType) => equipmentType.serviceDetails)
    @JoinColumn({ name: 'equipment_type_id' })
    equipment_type: EquipmentTypeEntity;

    @ManyToMany(() => KnowledgeBaseEntity, (knowledgeBase) => knowledgeBase.serviceDetails, { nullable: true, })
    @JoinTable({
        name: 'service_detail_knowledge_base',
        joinColumn: { name: 'service_detail_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'knowledge_base_id', referencedColumnName: 'id' }
    })
    knowledge_base?: KnowledgeBaseEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
