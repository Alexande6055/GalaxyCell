import { ProductEntity } from "src/app/products/entities/product.entity";
import { Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export class CategoryEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @OneToMany(() => ProductEntity, (product) => product.category)
    products: ProductEntity[];

}