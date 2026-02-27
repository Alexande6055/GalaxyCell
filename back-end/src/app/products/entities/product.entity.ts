import { CategoryEntity } from "src/app/category/entities/category.entity";
import { Column, CreateDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class ProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    price: string;

    @ManyToOne(() => CategoryEntity, (category) => category.products)
    @JoinColumn({ name: 'category_id' })
    category: CategoryEntity;


    @CreateDateColumn()

    createdAt: Date;

    @UpdateDateColumn()

    updatedAt: Date;
}