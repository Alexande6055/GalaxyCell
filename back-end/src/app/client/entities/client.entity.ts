import { ServiceOrderEntity } from "src/app/technical_services/service_orders/entities/service_order.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('client')
export class ClientEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    document_number: string;

    @Column()
    name: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @OneToMany(() => ServiceOrderEntity, (serviceOrder) => serviceOrder.client)
    serviceOrders: ServiceOrderEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

}
