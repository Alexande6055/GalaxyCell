Basado en el análisis de las funcionalidades, se identifican las siguientes entidades. El modelo relacional propuesto cubre la gestión de usuarios, productos, órdenes de compra, servicios técnicos, blog, notificaciones y otros aspectos operativos.

### Entidades principales

1. **Usuario**
    - Almacena la información de clientes, técnicos y administradores.
    - Atributos: `id`, `uidFirebase` (para vincular con Firebase Auth), `nombre`, `email`, `rol` (cliente, técnico, admin), `isActive` (activo/bloqueado).
        
2. **Categoría**
    - Clasifica los productos tecnológicos.
    - Atributos: `id`, `nombre`, `descripción` (opcional), `createdAt`, `updatedAt`, `deletedAt`.
        
3. **Marca**
    - Identifica las marcas de los productos.
    - Atributos: `id`, `nombre`, `descripción` (opcional), `createdAt`, `updatedAt`, `deletedAt`.
        
4. **Producto**
    - Representa los artículos disponibles para la venta.
    - Atributos: `id`, `nombre`, `descripción`, `precio`, `cantidad` (stock), `categoria_id` (FK), `marca_id` (FK), `estado` (activo/inactivo), `fecha_creacion`.
        
5. **ImagenProducto**
    - Gestiona las imágenes asociadas a cada producto.
    - Atributos: `id`, `producto_id` (FK), `url`, `es_principal`, `orden`.
        
6. **Carrito**
    - Representa el carrito de compras de un usuario (persistente mientras esté autenticado).
    - Atributos: `id`, `usuario_id` (FK, único), `fecha_creacion`, `fecha_actualizacion`.
        
7. **CarritoItem**
    - Detalla los productos agregados al carrito con sus cantidades.
    - Atributos: `id`, `carrito_id` (FK), `producto_id` (FK), `cantidad`, `fecha_agregado`.
        
8. **Orden** (Pedido)
    - Registra las órdenes de compra generadas por los clientes.
    - Atributos: `id`, `usuario_id` (FK), `fecha_creacion`, `estado` (activa, expirada, cancelada, pagada), `fecha_expiracion` (calculada), `total`, `motivo_cancelacion` (opcional).
        
9. **DetalleOrden**
    - Contiene los productos incluidos en cada orden, con precios del momento.
    - Atributos: `id`, `orden_id` (FK), `producto_id` (FK), `cantidad`, `precio_unitario`, `subtotal`.
        
10. **Servicio** (Solicitud de servicio técnico)
    - Almacena las solicitudes de reparación, mantenimiento, etc., realizadas por clientes.
    - Atributos: `id`, `usuario_id` (FK, cliente), `tecnico_id` (FK, opcional, nulleable), `fecha_solicitud`, `tipo_dispositivo`, `problema_descripcion`, `estado` (pendiente, en_diagnostico, en_reparacion, finalizado, entregado, cancelado), `motivo_cancelacion`.
        
11. **HistorialServicio**
    - Registra la trazabilidad de cambios de estado de cada servicio.
    - Atributos: `id`, `servicio_id` (FK), `estado_anterior`, `estado_nuevo`, `fecha_cambio`, `tecnico_id` (FK, responsable del cambio), `comentario`.
        
12. **CalificacionServicio**
    - Permite a los clientes calificar un servicio finalizado.
    - Atributos: `id`, `servicio_id` (FK, único), `puntuacion` (1-5), `comentario`, `fecha_calificacion`.
        
13. **BlogArticulo**
    - Contiene los artículos informativos del blog.
    - Atributos: `id`, `titulo`, `contenido`, `imagen_portada`, `autor_id` (FK a Usuario), `fecha_publicacion`, `estado` (borrador, publicado).
        
14. **ComentarioBlog**
    - Registra los comentarios de los usuarios en los artículos.
    - Atributos: `id`, `articulo_id` (FK), `usuario_id` (FK), `contenido`, `fecha_comentario`, `estado` (activo/eliminado).
        
15. **TokenNotificacion**
    - Almacena los tokens de dispositivos para notificaciones push (FCM).
    - Atributos: `id`, `usuario_id` (FK), `token`, `dispositivo` (opcional), `fecha_registro`.
        
16. **Anuncio** (opcional, para mostrar anuncios como banners)
    - Gestiona anuncios mostrados en la aplicación.
    - Atributos: `id`, `titulo`, `imagen_url`, `link_destino`, `fecha_inicio`, `fecha_fin`, `activo`.
        

### Relaciones clave
- Un **usuario** puede tener múltiples **órdenes**, **servicios** (como cliente), **comentarios**, **tokens** y un **carrito** (1:1).
- Un **producto** pertenece a una **categoría** y una **marca**, y puede tener múltiples **imágenes**.
- Una **orden** contiene varios **detalles** (productos) y pertenece a un **usuario**.
- Un **servicio** tiene un **historial** de cambios y opcionalmente una **calificación**; puede estar asignado a un **técnico** (usuario con rol técnico).
- Un **artículo** de blog puede tener múltiples **comentarios** de usuarios.

Estas entidades cubren los requerimientos funcionales identificados: autenticación, catálogo, carrito, órdenes, servicios técnicos con trazabilidad, blog, notificaciones y anuncios. La base de datos relacional PostgreSQL permitirá mantener la integridad y escalabilidad necesarias.


