## 1. Concepto Visual: "Tech-Minimal"

El estilo debe basarse en el **Glassmorphism** (efecto de cristal esmerilado) de manera sutil para las tarjetas de información y un diseño de interfaz **limpio** con mucho espacio en blanco para evitar la fatiga visual del administrador.

---

## 2. Paleta de Colores: "Electric Midnight"

He seleccionado una paleta que evoca la tecnología móvil y la elegancia de los dispositivos de gama alta.

| **Elemento**     | **Color**        | **Hexadecimal** | **Uso**                                      |
| ---------------- | ---------------- | --------------- | -------------------------------------------- |
| **Primario**     | Azul Eléctrico   | `#007BFF`       | Botones de acción, enlaces, selección.       |
| **Secundario**   | Azul Profundo    | `#1A237E`       | Barras de navegación lateral o encabezados.  |
| **Fondo**        | Gris Ultra-Claro | `#F8F9FA`       | Fondo general de la plataforma.              |
| **Superficie**   | Blanco Puro      | `#FFFFFF`       | Tarjetas (Cards), formularios y tablas.      |
| **Acento**       | Cian Neón        | `#00E5FF`       | Gráficos de ventas, estados de "disponible". |
| **Error/Alerta** | Rojo Coral       | `#FF5252`       | Stock bajo o errores de sistema.             |

---

## 3. Tipografía: Legibilidad y Estilo

Busca fuentes **Sans Serif** geométricas. Son modernas y funcionan perfecto en pantallas de alta resolución.

- **Principal (Títulos):** **Montserrat** (Peso: 700 / Bold). Da una sensación de solidez y confianza.
    
- **Cuerpo (Datos y Tablas):** **Inter** o **Roboto** (Peso: 400 / Regular). Es la reina de las interfaces administrativas por su altísima legibilidad en tamaños pequeños.
    

> **Tip:** Usa `Inter` para los números en las tablas de inventario; están diseñados para que los dígitos se alineen perfectamente.

---

## 4. Elementos de UI (Interfaz de Usuario)

### Iconografía

Utiliza iconos de **línea fina (Line Icons)**. Evita iconos muy coloridos o rellenos que saturen la vista.

- _Recomendación:_ [Lucide Icons](https://lucide.dev/) o [Phosphor Icons](https://phosphoricons.com/) **Implementar solo uno no dos**.
    

### Bordes y Sombras

- **Radio de borde (Border Radius):** Usa un redondeo suave de **12px** a **16px** para las tarjetas de inventario. Le da un toque moderno y menos "rígido".
    
- **Sombras (Shadows):** Sombras muy tenues y difusas.
    
    - _Ejemplo:_ `rgba(0, 0, 0, 0.05)` para que los elementos parezcan flotar sobre el fondo gris claro.
        

---

## 5. Estructura del Dashboard (Layout)

Para **Galaxy Cell**, la prioridad es el flujo de inventario:

1. **Sidebar (Izquierda):** Azul Profundo con iconos en blanco. Secciones: Dashboard, Inventario (Celulares/Accesorios), Ventas, Clientes y Reparaciones (Servicio Técnico).
    
2. **Top Bar:** Buscador global (importante para buscar por IMEI o modelo) y perfil de usuario.
    
3. **Main Content:** * **KPI Cards:** (Ventas del día, Equipos en stock, Reparaciones pendientes).
    
    - **Data Table:** Una tabla limpia con bandas de color muy sutiles para diferenciar filas.
        

---

## 6. Toque Distintivo (Branding)

Para que no sea "una plataforma más", añade:

- Un **gradiente suave** en el fondo de los botones principales que vaya del Azul Eléctrico al Cian Neón.
    
- Un **Modo Oscuro** (Dark Mode) bien diseñado, usando `#121212` como fondo, ya que a los técnicos de celulares les suele gustar trabajar con interfaces oscuras.