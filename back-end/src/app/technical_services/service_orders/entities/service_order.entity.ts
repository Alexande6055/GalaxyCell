import { ClientEntity } from "src/app/client/entities/client.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ServiceDetailEntity } from "../../service_details/entities/service_detail.entity";

export enum IncomeType {
    GARANTIA = 'garantia',
    EXTERNO = 'externo'
}

// 1. Definimos el Enum para el estado de la orden
export enum OrderStatus {
    PENDIENTE = 'pendiente',
    COMPLETADA = 'completada'
}

@Entity('service_order')
export class ServiceOrderEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: true })
    order_number: string;

    @Column({
        type: 'enum',
        enum: IncomeType,
        default: IncomeType.EXTERNO,
        nullable: true
    })
    income_type: IncomeType;

    // 2. Agregamos la columna de estado
    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDIENTE
    })
    status: OrderStatus;

    @Column()
    entry_date: Date;

    // 3. Agregamos la fecha de salida (nullable: true porque al inicio no tiene fecha)
    @Column({ type: 'timestamp', nullable: true })
    exit_date: Date;

    @ManyToOne(() => ClientEntity, (client) => client.serviceOrders)
    @JoinColumn({ name: 'client_id' })
    client: ClientEntity;

    @OneToMany(() => ServiceDetailEntity, (serviceDetail) => serviceDetail.serviceOrder)
    serviceDetails: ServiceDetailEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}