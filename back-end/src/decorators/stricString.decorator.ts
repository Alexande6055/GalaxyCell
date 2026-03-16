import { Transform } from 'class-transformer';

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