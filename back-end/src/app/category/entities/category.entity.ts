import { ProductEntity } from "src/app/products/entities/product.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

/**
 * Entidad de base de datos que representa una categoría de productos.
 * Mapeada a la tabla 'category'.
 */
@Entity('category')
export class CategoryEntity {
    /**
     * Identificador único de la categoría. Generado como UUID.
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * Nombre de la categoría. Debe ser único en el sistema.
     */
    @Column({ unique: true })
    name: string;

    /**
     * Descripción general de los productos que abarca la categoría.
     */
    @Column()
    description: string;

    /**
     * Relación de uno a muchos con la entidad ProductEntity.
     * Una categoría puede estar asociada a múltiples productos.
     */
    @OneToMany(() => ProductEntity, (product) => product.category)
    products: ProductEntity[];

    /**
     * Fecha y hora en la que se creó el registro de la categoría.
     */
    @CreateDateColumn()
    createdAt: Date;

    /**
     * Fecha y hora de la última actualización del registro.
     */
    @UpdateDateColumn()
    updatedAt: Date;

    /**
     * Fecha y hora en la que se realizó el borrado lógico del registro.
     * Si no se ha borrado, el valor es null.
     */
    @DeleteDateColumn()
    deletedAt: Date;
}