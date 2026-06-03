import { Transform } from 'class-transformer';

/**
 * Decorador de transformación para validar y desinfectar de manera estricta cadenas de texto.
 * 
 * Este decorador realiza las siguientes acciones:
 * 1. Convierte el valor a cadena y lo normaliza usando la forma Unicode NFC.
 * 2. Elimina caracteres de control ASCII invisibles para prevenir inyecciones.
 * 3. Valida mediante una expresión regular que el texto contenga únicamente caracteres alfabéticos (incluyendo tildes y eñes) y espacios.
 * 4. Aplica una capa de desinfección eliminando etiquetas HTML, eventos de JS y caracteres conflictivos de sintaxis de SQL/Shell.
 * 
 * Si el texto contiene caracteres inválidos como números o símbolos, la transformación retorna `null`.
 * 
 * @returns {PropertyDecorator} Un transformador de class-transformer para aplicar a las propiedades de los DTOs.
 */
export function StrictString() {
    return Transform(({ value }) => {
        if (value === null || value === undefined || value === '') return value;

        // 1. Convertir a string y normalización Unicode (NFC)
        // Esto evita ataques donde caracteres se ven iguales pero son códigos distintos
        let cleaned = String(value).normalize('NFC').trim();

        // 2. Eliminar caracteres de control invisibles (ASCII 0-31 y 127-159)
        // Estos se usan para romper parsers o esconder comandos
        cleaned = cleaned.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

        // 3. Regex de Letras Estricta (Solo permite lo que tú definiste)
        // \p{L} permite cualquier letra en cualquier idioma (incluye tildes y eñes)
        // \s permite espacios.
        // El flag 'u' es vital para manejar Unicode correctamente.
        const strictAlphaRegex = /^[^\d\W_]+(?: [^\d\W_]+)*$/u;

        // NOTA: Si quieres solo letras latinas básicas usa: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/

        if (!strictAlphaRegex.test(cleaned)) {
            return null; // Bloqueo total si hay números o símbolos
        }

        // 4. Capa final de desinfección (por si la regex se modifica después)
        cleaned = cleaned
            .replace(/<[^>]*>?/gm, '')           // HTML Tags
            .replace(/on\w+="[^"]*"/gm, '')      // JS Events
            .replace(/javascript:[^"]*/gm, '')   // JS Protocol
            .replace(/[<>'"\\;`]/g, '');         // Caracteres de ruptura de sintaxis (SQL/Shell)

        return cleaned;
    });
}