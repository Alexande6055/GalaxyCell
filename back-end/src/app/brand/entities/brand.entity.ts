import { ProductEntity } from "src/app/products/entities/product.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

/**
 * Entidad de base de datos que representa una marca de productos.
 * Mapeada a la tabla 'brand'.
 */
@Entity('brand')
export class BrandEntity {
    /**
     * Identificador único de la marca. Generado como UUID.
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * Nombre de la marca. Debe ser único en el sistema.
     */
    @Column({ unique: true })
    name: string;

    /**
     * Descripción general de la marca o su origen.
     */
    @Column()
    description: string;

    /**
     * Relación de uno a muchos con la entidad ProductEntity.
     * Una marca puede estar asociada a múltiples productos.
     */
    @OneToMany(() => ProductEntity, (product) => product.category)
    products: ProductEntity[];

    /**
     * Fecha y hora de creación del registro.
     */
    @CreateDateColumn()
    createdAt: Date;

    /**
     * Fecha y hora de la última actualización del registro.
     */
    @UpdateDateColumn()
    updatedAt: Date;

    /**
     * Fecha y hora en la que se aplicó el borrado lógico a la marca.
     */
    @DeleteDateColumn()
    deletedAt: Date;
}
