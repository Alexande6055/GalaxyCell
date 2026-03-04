import { ServiceOrderEntity } from "src/app/technical_services/service_orders/entities/service_order.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

}
