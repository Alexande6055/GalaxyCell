---
---
## Gestión de Autenticación[//]
### Descripción
El sistema utiliza un servicio externo para la gestión de autenticación y control de acceso de los usuarios.
### Implementación
La autenticación de usuarios se gestiona mediante **Firebase Authentication**, el cual se encarga de:
- Registro de usuarios.
- Inicio de sesión.
- Recuperación de contraseña.
- Gestión segura de credenciales.
- Validación de identidad del usuario.
### Funcionamiento
1. El usuario introduce sus credenciales en la aplicación.
2. La aplicación envía la solicitud a Firebase Authentication.
3. Firebase valida las credenciales.
4. Si son correctas, devuelve un **token de autenticación** que permite acceder a los recursos del sistema.
### Dependencias
- Firebase Authentication.
- Conectividad a internet.

### Usuario del sistema GalaxyCell 
```typescript 
export class Auth {
uidFirebase: string;
nombre: string;
email: string;
rol: RolUsuario;
}
```
## Sistema de Notificaciones Push[//]
### Descripción
El sistema utiliza un servicio externo para enviar notificaciones push a los dispositivos móviles de los usuarios con el fin de informar sobre eventos relevantes dentro de la aplicación.
### Implementación
Las notificaciones se gestionan mediante **Firebase Cloud Messaging**, el cual permite enviar mensajes en tiempo real a los dispositivos registrados en la aplicación.
### Eventos que generan notificaciones
El sistema enviará notificaciones en los siguientes casos:
- Confirmación de solicitud de servicio técnico.
- Actualización del estado del servicio.
- Confirmación de una orden de compra.
- Recordatorios o avisos importantes del sistema.
### Funcionamiento
1. El dispositivo del usuario se registra en **Firebase Cloud Messaging**.
2. FCM genera un **token único del dispositivo**.
3. La aplicación guarda ese token asociado al usuario.
4. Cuando ocurre un evento relevante, el sistema envía una notificación al dispositivo mediante FCM.
### Dependencias
- **Firebase Cloud Messaging**
- Conexión a internet.
---
## App Mobile (Enfocada al Cliente)
La aplicación móvil está orientada al cliente final y permite consultar productos, interactuar con el blog, generar órdenes de compra y solicitar servicios técnicos para dispositivos electrónicos.

Los usuarios que tengan una cuenta creada en el sistema administrativo podrán utilizar **las mismas credenciales para acceder a la aplicación móvil**.
### Funcionalidades para usuarios con cuenta[//]

#### Ver historial de servicio técnico [//]
##### Descripción
Permite al cliente visualizar el historial completo de cambios de estado de una solicitud de servicio técnico, incluyendo fechas, estados y técnicos asignados, brindando trazabilidad y transparencia sobre el proceso.
##### Funcionamiento
1. El usuario inicia sesión y accede a la sección "Mis servicios".
2. Selecciona una solicitud de servicio específica.
3. Además del estado actual, el sistema muestra un apartado de **Historial** con una lista cronológica de todos los cambios de estado registrados.
4. Cada entrada del historial incluye:
    - **Fecha y hora** del cambio
    - **Estado anterior y nuevo estado**
    - **Técnico responsable** (si aplica)
    - **Comentario adicional** (opcional)
5. El usuario puede consultar el historial para conocer la evolución de su servicio.
##### Requisitos
- Usuario autenticado.
- Solicitud de servicio existente asociada al usuario.
##### Dependencias
- Sistema de solicitudes de servicio.
- Sistema de usuarios (para identificar técnicos).

#### Calificar servicio técnico[//]
##### Descripción
Una vez que el servicio técnico ha sido finalizado y entregado, el cliente puede calificar la experiencia y dejar un comentario, lo que ayuda a mejorar la calidad del servicio y genera confianza en otros usuarios.
##### Funcionamiento
1. El usuario accede a la sección "Mis servicios" y selecciona un servicio cuyo estado sea **Finalizado** o **Entregado**.
2. El sistema muestra la opción **Calificar servicio**.
3. El usuario puede:
    - Asignar una puntuación de 1 a 5 estrellas.
    - Escribir un comentario opcional sobre su experiencia.
4. Al enviar la calificación, el sistema guarda la puntuación y el comentario asociados a la solicitud.
5. La calificación queda visible para el administrador y técnicos en el panel administrativo, y puede ser utilizada para métricas de satisfacción.
6. Una vez calificado, el servicio no podrá ser calificado nuevamente.
##### Requisitos
- Usuario autenticado.
- Servicio en estado **Finalizado** o **Entregado**.
- Que el servicio no haya sido calificado previamente.
##### Dependencias
- Sistema de solicitudes de servicio.
- Sistema de usuarios.
#### Cancelar orden de compra[//]
##### Descripción
Permite al cliente cancelar una orden de compra activa antes de que expire el plazo de reserva de 48 horas, liberando el stock reservado para que otros usuarios puedan adquirir los productos.
##### Funcionamiento
1. El usuario inicia sesión y accede a la sección "Mis órdenes".
2. El sistema muestra un listado de las órdenes realizadas, indicando su estado (activa, expirada, cancelada, pagada).
3. El usuario selecciona una orden con estado **activa**.
4. Presiona el botón **Cancelar orden**.
5. El sistema solicita confirmación para evitar acciones accidentales.
6. Al confirmar:
    - El estado de la orden cambia a **cancelada**.
    - Se libera el stock de los productos asociados (incrementando la cantidad disponible).
    - Se registra la fecha y hora de cancelación.
7. El usuario puede visualizar la orden cancelada en su historial con el estado actualizado.
##### Requisitos
- Usuario autenticado.
- Orden existente con estado **activa** (dentro del plazo de 48 horas).
##### Dependencias
- Sistema de órdenes de compra.
- Sistema de inventario.
#### Gestión de carrito[//]
##### Descripción
El carrito de compras es un espacio temporal donde el usuario puede gestionar los productos que desea adquirir antes de generar una orden de compra. Permite agregar, eliminar y modificar cantidades, así como visualizar el subtotal actualizado.
##### Funcionamiento
1. El usuario navega por el catálogo de productos y desde la pantalla de detalle puede agregar un producto al carrito.
2. Al acceder al carrito, se muestra una lista con:
    - Productos agregados
    - Cantidad seleccionada (con opción de aumentarla o disminuirla, respetando el stock disponible)
    - Precio unitario
    - Subtotal por producto
    - Subtotal total de la compra
3. El usuario puede:
    - **Eliminar** un producto del carrito.
    - **Actualizar la cantidad** de un producto (si hay stock suficiente).
    - **Vaciar** el carrito por completo.
4. Los cambios en el carrito se reflejan inmediatamente en el subtotal.
5. El carrito persiste mientras el usuario permanezca autenticado, incluso si cierra y vuelve a abrir la aplicación.
6. Desde el carrito, el usuario puede proceder a **Generar Orden de Compra**, lo que llevará a la creación de la orden con los productos actuales.
##### Requisitos
- Usuario autenticado.
- Productos disponibles con stock suficiente.
##### Dependencias
- Catálogo de productos.
- Sistema de inventario.
- Sistema de órdenes de compra.
#### Comentar en el blog[//]
##### Descripción
Permite a los usuarios registrados publicar comentarios dentro de los artículos del blog relacionados con problemas recurrentes, recomendaciones o información técnica.
##### Funcionamiento
1. El usuario inicia sesión en la aplicación.
2. Accede al apartado del blog.
3. Selecciona un artículo.
4. Escribe un comentario en la sección correspondiente.
5. El comentario se guarda en la base de datos y se muestra públicamente.
##### Requisitos
- El usuario debe estar autenticado.
- El artículo del blog debe existir.
##### Dependencias
- Sistema de autenticación de usuario.
- Módulo del blog.
#### Generar Orden de Compra[//]
##### Descripción
Permite al usuario generar un comprobante temporal que reserva los productos seleccionados durante **48 horas**, evitando que otros clientes puedan adquirirlos en ese tiempo.
##### Funcionamiento

1. El usuario navega por el catálogo de productos.
2. Agrega productos al carrito.
3. Solicita generar una orden de compra.
4. El sistema verifica disponibilidad de stock.
5. Se crea un registro de orden con fecha de expiración de 48 horas.
6. El sistema descuenta temporalmente el stock disponible.
##### Requisitos
- Usuario autenticado.
- Existencia de stock disponible.
##### Dependencias
- Catálogo de productos.
- Sistema de inventario.
- Sistema de usuarios.
#### Solicitar Servicio[//]
##### Descripción
Permite a los clientes solicitar servicios técnicos relacionados con dispositivos electrónicos.
Ejemplos de servicios:
- Reparación
- Actualización
- Mantenimiento
- Mejora de hardware o software
##### Funcionamiento
1. El usuario inicia sesión.
2. Accede a la sección de servicios.
3. Completa un formulario con:
    - Tipo de dispositivo
    - Problema o servicio requerido
    - Descripción
4. El sistema registra la solicitud.
5. Se asigna un estado inicial: **Pendiente**.
6. Los técnicos podrán posteriormente gestionar la solicitud.
##### Requisitos
- Usuario autenticado.
- Formulario de solicitud completado.
##### Dependencias
- Sistema de usuarios.
- Sistema administrativo de técnicos.


#### Consultar estado de servicio[//]
##### Descripción
Permite al cliente visualizar el estado actual de su solicitud de servicio técnico.
##### Funcionamiento
1. El usuario accede a la sección de servicios.
2. El sistema muestra las solicitudes realizadas.
3. Se visualiza el estado actualizado del servicio.
##### Dependencias
- Sistema de solicitudes de servicio.

#### Consultar historial de órdenes[//]
##### Descripción
Permite al cliente visualizar todas las órdenes de compra que ha generado anteriormente, incluyendo su estado (activa, expirada, completada) y los productos asociados.
##### Funcionamiento
1. El usuario inicia sesión y accede a la sección "Mis órdenes".
2. El sistema consulta la base de datos y muestra un listado de las órdenes realizadas por el usuario.
3. Para cada orden se muestra:
    - Número de orden
    - Fecha de creación
    - Estado (vigente, expirada, pagada)
    - Total de productos
    - Monto total
4. El usuario puede seleccionar una orden para ver el detalle de los productos incluidos.
##### Requisitos
- Usuario autenticado.
- Haber generado al menos una orden previamente.
##### Dependencias
- Sistema de órdenes de compra.
- Sistema de autenticación.
### Funcionalidades para usuarios sin cuenta[//]
#### Ver detalle de producto[//]
##### Descripción
Muestra información completa y detallada de un producto seleccionado desde el catálogo, permitiendo al usuario conocer todas sus características antes de decidir su compra.
##### Funcionamiento
1. El usuario accede al catálogo de productos y hace clic en un producto de su interés.
2. El sistema carga la pantalla de detalle con la siguiente información:
    - **Galería de imágenes**: Una o varias fotos del producto, con posibilidad de navegar entre ellas.
    - **Nombre del producto**
    - **Precio**
    - **Marca**
    - **Categoría**
    - **Disponibilidad**: Indicación visual de stock (ej. "En stock", "Pocas unidades", "Agotado").
    - **Descripción completa**: Detalles técnicos, características, especificaciones.
3. Si el usuario está autenticado, se muestra un botón **Agregar al carrito**. Si no lo está, se muestra un mensaje invitando a iniciar sesión o registrarse para comprar.
4. El usuario puede regresar al catálogo o continuar navegando.
##### Requisitos
- Producto existente en el catálogo.
##### Dependencias
- Sistema de gestión de productos.
- Sistema de autenticación (para habilitar el botón de compra).
#### Crear Usuario (CLIENTE)[//]
##### Descripción
Permite a nuevos usuarios registrarse en el sistema para acceder a las funcionalidades completas de la aplicación.
##### Funcionamiento
1. El usuario accede a la opción de registro.
2. Completa un formulario con datos personales.
3. El sistema valida la información.
4. Se crea una cuenta en la base de datos.
##### Requisitos
- Datos obligatorios completos.
- El correo o usuario no debe existir previamente.
##### Dependencias
- Sistema de autenticación.
#### Visualizar productos[//]
##### Descripción
Permite a cualquier usuario consultar el catálogo de productos disponibles sin necesidad de iniciar sesión.
##### Funcionamiento
1. El usuario accede a la sección de productos.
2. El sistema muestra el catálogo disponible.
3. Se puede visualizar información como:
    - nombre
    - precio
    - descripción
    - disponibilidad
##### Requisitos
- Existencia de productos registrados.

##### Dependencias
- Sistema de gestión de productos.
#### Ingresar al apartado del blog (Problemas recurrentes)[//]
##### Descripción
Permite acceder a artículos informativos relacionados con problemas comunes en dispositivos electrónicos.
##### Funcionamiento
1. El usuario accede a la sección del blog.
2. El sistema muestra los artículos disponibles.
3. El usuario puede leer el contenido.
##### Requisitos
- Artículos publicados.
##### Dependencias
- Módulo de blog.

### Funcionalidades propias de la App (Automáticas) 

#### Notificaciones Push[//]
##### Descripción
Permite enviar notificaciones directamente al dispositivo móvil del cliente para informar sobre eventos relevantes.
##### Tipos de notificaciones
- Nuevo producto disponible
- Promociones o descuentos
- Estado de servicio técnico
- Recordatorio de orden de compra
##### Funcionamiento
1. El sistema detecta un evento relevante.
2. Se genera una notificación.
3. La aplicación móvil recibe la notificación en el dispositivo del usuario.
##### Requisitos
- Usuario con la app instalada.
- Permisos de notificación habilitados.
##### Dependencias
- Sistema de eventos.
- Sistema de servicios técnicos.
- Catálogo de productos.

#OPCIONAL 
#### Mostrar anuncios en la aplicación

##### Descripción
Permite mostrar anuncios dentro de la aplicación móvil como mecanismo de monetización para el propietario del sistema, procurando que estos no resulten intrusivos para el usuario final.
Los anuncios pueden estar relacionados con productos tecnológicos, servicios o promociones relevantes para los usuarios.
##### Funcionamiento
1. El sistema obtiene anuncios desde una plataforma de publicidad o base de datos interna.
2. Los anuncios se cargan en determinadas secciones de la aplicación.
3. Se muestran en momentos específicos de navegación, evitando interrumpir acciones críticas del usuario.
4. El usuario puede interactuar con el anuncio o ignorarlo.
##### Ubicación de los anuncios
Los anuncios pueden mostrarse en:
- Secciones del catálogo de productos
- Apartado del blog
- Pantallas secundarias de navegación
- Banners discretos dentro de la interfaz
##### Requisitos
- Conexión a internet.
- Integración con plataforma de anuncios o sistema interno de gestión publicitaria.
##### Dependencias
- Sistema de anuncios o plataforma publicitaria.
- Conectividad de red.

>[!Nota] Los anuncios no deben mostrarse durante procesos críticos como generación de órdenes de compra, solicitudes de servicio o formularios de registro.

#### Cancelación automática de órdenes[//]
##### Descripción
El sistema cancela automáticamente las órdenes de compra que no han sido pagadas dentro del plazo de reserva (48 horas), liberando el stock reservado para que otros clientes puedan adquirir los productos.
##### Funcionamiento
1. Un proceso programado (cron job) se ejecuta periódicamente (por ejemplo, cada hora).
2. El proceso identifica todas las órdenes con estado "activa" cuya fecha de creación sea superior a 48 horas.
3. Para cada orden encontrada:
    - Se libera el stock de los productos asociados (incrementando la cantidad disponible).
    - Se actualiza el estado de la orden a "expirada".
4. El sistema puede opcionalmente enviar una notificación al usuario informando que su orden ha expirado.
##### Requisitos
- Orden con estado "activa" y plazo vencido.
- Proceso automático configurado en el backend.
##### Dependencias
- Sistema de órdenes.
- Sistema de inventario.
- Programador de tareas (ej. cron, job scheduler).
#### Paginacion de catalogo de productos[//]
Para optimizar el rendimiento y la experiencia de usuario, el catálogo de productos se carga de forma paginada, mostrando un número limitado de productos por página y permitiendo al usuario cargar más bajo demanda.
##### Funcionamiento
1. Al acceder a la sección de productos, la aplicación solicita al backend la primera página (por ejemplo, 20 productos).
2. El usuario puede desplazarse hacia abajo para ver más productos.
3. Cuando el usuario llega al final de la lista actual, la aplicación solicita automáticamente la siguiente página.
4. Los productos se agregan a la lista existente sin recargar toda la pantalla.
##### Requisitos
- Conexión a internet.
- Backend que soporte paginación (parámetros `page` y `limit`).
##### Dependencias
- API de productos.
- Manejo de estado en la aplicación.


#OPCIONAL 
#### Búsqueda y filtrado de productos
##### Descripción
Permite a los usuarios buscar productos por nombre, categoría, marca o rango de precio, facilitando la localización de artículos específicos dentro del catálogo.
##### Funcionamiento
1. El usuario ingresa un término de búsqueda en un campo de texto o selecciona filtros (categoría, marca, precio mínimo/máximo).
2. La aplicación envía los criterios al backend.
3. El backend devuelve los productos que coinciden con los criterios.
4. Los resultados se muestran en la misma interfaz de catálogo, reemplazando la lista actual.
5. Se pueden combinar múltiples filtros para refinar la búsqueda.
##### Requisitos
- Conexión a internet.
- Backend que soporte búsqueda y filtrado.
##### Dependencias
- API de productos.
### Funcionalidades Administrativas en la App
#### Eliminar comentario[//]
##### Descripción
Permite eliminar comentarios inapropiados o irrelevantes publicados en el blog.
##### Funcionamiento
1. Un administrador/Técnico accede al panel correspondiente.
2. Visualiza la lista de comentarios.
3. Selecciona el comentario a eliminar.
4. El sistema elimina el registro.
##### Requisitos
- Permisos de administrador/Técnico.
##### Dependencias

---
---
## Web Administrativa[//] 
La web administrativa está diseñada para uso interno dentro del local y permite gestionar productos, técnicos y servicios.
### Admin[//]

#### Crear Usuario (TÉCNICO)[//]
##### Descripción
Permite registrar nuevos técnicos dentro del sistema.
##### Funcionamiento
1. El administrador accede al módulo de usuarios.
2. Ingresa los datos del técnico.
3. El sistema crea la cuenta.
##### Requisitos
- Permisos de administrador.
##### Dependencias
- Sistema de usuarios.
#### Bloquear Usuario (TÉCNICO)[//]
##### Descripción
Permite deshabilitar el acceso a un técnico dentro del sistema.
##### Funcionamiento
1. El administrador selecciona el usuario técnico.
2. Cambia su estado a **bloqueado**.
3. El técnico no podrá iniciar sesión.
##### Requisitos
- Usuario técnico existente.
##### Dependencias
- Sistema de usuarios.

#### Crear marca de producto[//]
##### Descripción
Permite registrar nuevas marcas asociadas a los productos disponibles en el catálogo.
##### Funcionamiento
1. El administrador accede al módulo de marcas.
2. Ingresa el nombre de la marca.
3. El sistema guarda la nueva marca en la base de datos.
##### Requisitos
- Nombre de marca válido.
##### Dependencias
- Sistema de gestión de productos.
#### Editar marca de dispositivo[//]
##### Descripción

Permite modificar la información de una marca previamente registrada.
##### Funcionamiento
1. El administrador selecciona una marca existente.
2. Modifica los datos correspondientes.
3. El sistema actualiza la información.
##### Requisitos
- Marca existente.
##### Dependencias
- Sistema de marcas.
#### Crear Categoría de producto[//]
##### Descripción
Permite crear categorías para organizar los productos dentro del catálogo.
##### Funcionamiento
1. El administrador accede al módulo de categorías.
2. Ingresa el nombre de la categoría.
3. El sistema registra la nueva categoría.
##### Requisitos
- Nombre de categoría válido.
##### Dependencias
- Sistema de productos.
#### Crear Producto[//]
##### Descripción
Permite registrar nuevos productos dentro del catálogo del sistema.
##### Funcionamiento
1. El administrador accede al módulo de productos.
2. Ingresa la información del producto:
    - nombre
    - descripción
    - precio
    - cantidad inicial
    - categoría
    - marca
3. El sistema guarda el producto en la base de datos.
##### Requisitos
- Categoría existente.
- Marca existente.
- Permisos de administrador.
##### Dependencias
- Sistema de inventario.
- Sistema de categorías.
- Sistema de marcas.
```typescript
export class ProductEntity {
id: string;
name: string;
description: string;
price: number;
quantity: number;
category: CategoryEntity;
brand: BrandEntity;
}
```
#### Abastecer stock[//]
##### Descripción
Permite aumentar la cantidad disponible de un producto en el inventario.
##### Funcionamiento
1. El administrador selecciona un producto.
2. Ingresa la cantidad a agregar.
3. El sistema actualiza el stock disponible.
##### Requisitos
- Producto existente.
##### Dependencias
- Sistema de productos.
- Sistema de productos.
#### Editar Producto[//]
##### Descripción
Permite modificar la información de un producto existente dentro del catálogo.
##### Funcionamiento
1. El administrador selecciona el producto.
2. Modifica los datos necesarios (precio, descripción, categoría, etc.).
3. El sistema guarda los cambios.
##### Requisitos
- Producto existente.
- Permisos de administrador.
##### Dependencias
- Sistema de productos.
- Sistema de categorías.
- Sistema de marcas.

#### ver solicitudes[//]
##### Descripción
Permite al administrador visualizar todas las solicitudes de servicio técnico registradas por los clientes, con la posibilidad de filtrarlas por estado, fecha o técnico asignado.
##### Funcionamiento
1. El administrador accede al módulo de "Solicitudes de servicio".
2. El sistema muestra un listado completo con las siguientes columnas:
    - Cliente
    - Dispositivo
    - Fecha de solicitud
    - Estado actual
    - Técnico asignado (si aplica)
3. El administrador puede hacer clic en una solicitud para ver el detalle completo.
4. Se pueden aplicar filtros para facilitar la búsqueda.
##### Requisitos
- Permisos de administrador.
- Solicitudes existentes en el sistema.
##### Dependencias
- Sistema de solicitudes de servicio.
#### asignar técnicos[//]
##### Descripción
Permite al administrador asignar un técnico específico a una solicitud de servicio, para que este se encargue de su diagnóstico y reparación.
##### Funcionamiento
1. El administrador accede al detalle de una solicitud de servicio.
2. En la sección de asignación, selecciona un técnico de una lista de técnicos disponibles.
3. El sistema guarda la asignación y actualiza el estado de la solicitud (por ejemplo, a "En diagnóstico").
4. El técnico asignado recibirá una notificación (si el sistema lo soporta) y podrá ver la solicitud en su lista.
##### Requisitos
- Solicitud existente.
- Técnicos registrados y activos.
- Permisos de administrador.
##### Dependencias
- Sistema de solicitudes.
- Sistema de usuarios (técnicos).
#### cancelar servicios[//]
##### Descripción
Permite al administrador cancelar una solicitud de servicio por razones justificadas (falta de repuestos, decisión del cliente, etc.), registrando el motivo de la cancelación.
##### Funcionamiento
1. El administrador accede al detalle de la solicitud.
2. Selecciona la opción "Cancelar servicio".
3. Ingresa un motivo de cancelación.
4. El sistema cambia el estado de la solicitud a "Cancelado" y registra el motivo.
5. Opcionalmente, se envía una notificación al cliente informando la cancelación.
##### Requisitos
- Solicitud existente y no finalizada.
- Permisos de administrador.
##### Dependencias
- Sistema de solicitudes.

#### Gestión de imágenes de productos (Opcional)[//]
##### Descripción
Permite al administrador asignar una o múltiples imágenes a un producto para mostrarlas en el catálogo. Se puede definir una imagen principal y una galería de imágenes secundarias.
##### Funcionamiento
1. Al crear o editar un producto, el administrador puede cargar imágenes desde su dispositivo.
2. El sistema permite subir una imagen principal y varias imágenes adicionales.
3. Las imágenes se almacenan en el servidor donde se encuentra del backend y se asocian al producto en la base de datos.
4. En la vista de edición, el administrador puede:
    - Subir nuevas imágenes.
    - Eliminar imágenes existentes.
    - Establecer cuál es la imagen principal.
5. La aplicación móvil y web mostrarán la imagen principal y permitirán navegar por la galería.
##### Requisitos
- Producto existente.
- Permisos de administrador.
- Servicio de almacenamiento de archivos configurado.
##### Dependencias
- Sistema de productos.
- Servicio de almacenamiento.
#### Dashboard Interactivo[//]
##### Descripción
Proporciona al administrador una vista resumida con indicadores clave de negocio para facilitar la toma de decisiones. El dashboard se actualiza en tiempo real o bajo demanda.
##### Funcionalidades propias del dashboard
- **Productos más vendidos**: Lista de los productos con mayor cantidad de ventas en un período seleccionable (ej. última semana, mes).
 #OPCIONAL
- **Clientes más activos**: Usuarios que más compras o solicitudes han realizado. 
- **Ingresos estimados**: Suma total de ventas y servicios completados en el período, con posible desglose por método de pago.
- **Stock bajo**: Productos con cantidad por debajo de un umbral definido.
- **Órdenes pendientes**: Número de órdenes de compra activas y próximas a expirar.
 #OPCIONAL
- **Solicitudes de servicio por estado**: Gráfico que muestra la distribución de servicios en cada etapa.
##### Funcionamiento#OPCIONAL
1. El administrador accede al dashboard desde el menú principal.
2. Por defecto, se muestran los datos del mes actual, pero puede seleccionar un rango de fechas personalizado.
3. Los datos se obtienen mediante consultas a la base de datos y se presentan en formato de tarjetas, tablas y gráficos (barras, pastel).
4. Al hacer clic en un elemento (ej. producto más vendido), puede navegar al detalle correspondiente.
##### Requisitos
- Permisos de administrador.
- Datos históricos de ventas y servicios.
##### Dependencias
- Sistema de ventas/órdenes.
- Sistema de servicios.
- Sistema de usuarios.
### Técnico[//]
#### Actualizar Estado de Servicio[//]
##### Descripción
Permite al técnico modificar el estado de una solicitud de servicio realizada por un cliente.
##### Funcionamiento
1. El técnico accede al listado de solicitudes de servicio.
2. Selecciona la solicitud correspondiente.
3. Cambia el estado del servicio.

Estados posibles:
- Pendiente
- En diagnóstico
- En reparación
- Finalizado
- Entregado
##### Requisitos
- Servicio registrado en el sistema.
##### Dependencias
- Sistema de solicitudes de servicio.
#### Atender Cita de Servicio[//]
##### Descripción
Permite registrar que un servicio técnico programado ha sido atendido.
##### Funcionamiento
1. El técnico consulta la lista de citas o servicios asignados.
2. Selecciona la cita correspondiente.
3. Registra la atención del servicio.
4. Se actualiza el estado de la solicitud.
##### Requisitos
- Cita o servicio previamente registrado.
##### Dependencias
- Sistema de solicitudes de servicio.
- Sistema de usuarios.


### Ambos (Admin y Técnico)[//]
Gestión del Blog 
Tienes **comentarios**, pero falta la **gestión de artículos**.
El administrador/tecnico debería poder:
- Crear artículos
- Editar artículos
- Eliminar artículos
#### Gestión del Blog[//]
##### Descripción
Permite a los administradores y técnicos (con permisos adecuados) crear, editar, eliminar y publicar artículos en el blog informativo de la aplicación.
##### Funcionalidades específicas
- **Crear artículo**: El usuario accede a un formulario donde ingresa título, contenido (con editor de texto enriquecido), imágenes destacadas.
- **Editar artículo**: Permite modificar el contenido de un artículo existente, así como su estado (borrador/publicado).
- **Eliminar artículo**: Elimina permanentemente un artículo del sistema (con confirmación previa).
#OPCIONAL 
- **Listar artículos**: Visualiza todos los artículos con filtros por estado, autor, fecha.

##### Funcionamiento (para Crear artículo)
1. El usuario accede al módulo de blog y selecciona "Nuevo artículo".
2. Completa los campos:
    - Título
    - Contenido (usando un editor WYSIWYG)
    - Imagen de portada
    - Etiquetas o categorías (opcional)
3. Lo publica.
4. El sistema almacena el artículo en la base de datos con la fecha de creación y el autor.
##### Requisitos
- Usuario autenticado con rol de administrador o técnico con permisos de gestión de blog.
- Datos mínimos completos (título y contenido).
##### Dependencias
- Sistema de usuarios (para autoría).
- Sistema de almacenamiento de imágenes (opcional).3

#### Ver historial de servicio técnico (para administradores)[//]
##### Descripción
Permite al administrador consultar el historial completo de cambios de estado de cualquier solicitud de servicio, con fines de supervisión y auditoría.
##### Funcionamiento
1. El administrador accede al módulo de "Solicitudes de servicio".
2. Selecciona una solicitud específica.
3. En la pantalla de detalle, se muestra una pestaña o sección de **Historial** con todos los cambios registrados, incluyendo fechas, estados anteriores y nuevos, y técnicos responsables.
4. El administrador puede filtrar por fechas o técnicos si es necesario.
##### Requisitos
- Permisos de administrador.
- Solicitud existente.
##### Dependencias
- Sistema de solicitudes de servicio.