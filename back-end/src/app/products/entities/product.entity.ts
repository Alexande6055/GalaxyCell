import { BrandEntity } from "src/app/brand/entities/brand.entity";
import { CategoryEntity } from "src/app/category/entities/category.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

/**
 * Entidad de base de datos que representa un producto del catálogo de GalaxyCell.
 * Mapeada a la tabla 'product'.
 */
@Entity('product')
export class ProductEntity {
    /**
     * Identificador único del producto. Generado como UUID.
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * Nombre comercial del producto.
     */
    @Column()
    name: string;

    /**
     * Descripción o especificaciones técnicas del producto.
     */
    @Column()
    description: string;

    /**
     * Precio del producto. Almacenado como decimal de precisión (10 dígitos en total, 2 decimales).
     */
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    price: number;

    /**
     * Cantidad disponible en stock.
     */
    @Column()
    quantity: number;

    /**
     * Relación muchos a uno con la entidad CategoryEntity.
     * Mapeado en la columna 'category_id'.
     */
    @ManyToOne(() => CategoryEntity, (category) => category.products)
    @JoinColumn({ name: 'category_id' })
    category: CategoryEntity;

    /**
     * Relación muchos a uno con la entidad BrandEntity.
     * Mapeado en la columna 'brand_id'.
     */
    @ManyToOne(() => BrandEntity, (brand) => brand.products)
    @JoinColumn({ name: 'brand_id' })
    brand: BrandEntity;

    /**
     * Fecha y hora en la que se registró el producto.
     */
    @CreateDateColumn()
    createdAt: Date;

    /**
     * Fecha y hora de la última modificación en el registro del producto.
     */
    @UpdateDateColumn()
    updatedAt: Date;

    /**
     * Fecha y hora en la que se aplicó el borrado lógico.
     */
    @DeleteDateColumn()
    deletedAt: Date;
}