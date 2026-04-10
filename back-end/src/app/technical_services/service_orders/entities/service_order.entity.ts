import { ClientEntity } from "src/app/client/entities/client.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EquipmentTypeEntity } from "../../equipment_types/entities/equipment_type.entity";
import { ServiceDetailEntity } from "../../service_details/entities/service_detail.entity";

export enum IncomeType {
    GARANTIA = 'garantia',
    EXTERNO = 'externo'
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

    @Column()
    entry_date: Date;

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
