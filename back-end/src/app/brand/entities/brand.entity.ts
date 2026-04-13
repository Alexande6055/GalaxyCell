import { ProductEntity } from "src/app/products/entities/product.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('brand')
export class BrandEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true }) // Agregado para que coincida con tu tabla
    description: string;

    @Column({ type: 'boolean', default: true }) // <--- NUEVA COLUMNA
    isActive: boolean;

    @OneToMany(() => ProductEntity, (product) => product.brand)
    products: ProductEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}