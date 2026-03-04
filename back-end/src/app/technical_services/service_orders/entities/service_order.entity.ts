import { ClientEntity } from "src/app/client/entities/client.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EquipmentTypeEntity } from "../../equipment_types/entities/equipment_type.entity";

@Entity('service_order')
export class ServiceOrderEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ nullable: true })
    order_number: string;

    @Column()
    entry_date: Date;

    @ManyToOne(() => ClientEntity, (client) => client.serviceOrders)
    @JoinColumn({ name: 'client_id' })
    client: ClientEntity;

}
    