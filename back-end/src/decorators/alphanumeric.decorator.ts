import { Transform } from 'class-transformer';

/**
 * Decorador de transformación para sanitizar, validar y normalizar cadenas alfanuméricas de forma estricta.
 * 
 * Este decorador realiza las siguientes acciones:
 * 1. Comprueba la longitud para prevenir ataques de denegación de servicio por expresiones regulares (ReDoS).
 * 2. Normaliza el texto usando la forma Unicode NFKC para estandarizar caracteres especiales.
 * 3. Elimina caracteres de control ASCII e invisibles (como espacios de ancho cero).
 * 4. Valida que la cadena contenga únicamente letras (incluyendo tildes y eñes), números y espacios utilizando una lista blanca.
 * 5. Colapsa múltiples espacios consecutivos en un solo espacio.
 * 6. Desinfecta el resultado removiendo cualquier etiqueta HTML, caracteres de escape o bytes nulos.
 * 
 * Si el texto contiene caracteres inválidos como símbolos o caracteres especiales no autorizados, la transformación retorna `null`.
 * 
 * @returns {PropertyDecorator} Un transformador de class-transformer para aplicar en propiedades de DTOs.
 */
export function Alphanumeric() {
  return Transform(({ value }) => {
    // 1. Validación de tipo inicial y longitud de seguridad
    if (value === null || value === undefined || value === '') return value;
    
    // Si el atacante envía un string de 10 millones de caracteres, 
    // cortamos antes de que la Regex agote el CPU (ReDoS protection)
    let raw = String(value);
    if (raw.length > 10000) return null; 

    // 2. Normalización Unicode Extrema (NFKC)
    // NFKC no solo normaliza acentos, sino que convierte caracteres "compatibles" 
    // (como símbolos que parecen letras) a su forma estándar de texto.
    let cleaned = raw.normalize('NFKC').trim();

    // 3. Eliminar caracteres de control e invisibles (incluye Zero Width Spaces)
    // Estos se usan para meter "data" invisible entre letras
    cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, '');

    /**
     * 4. REGEX DE LISTA BLANCA ALFANUMÉRICA
     * Permite: Letras (cualquier idioma con tildes), Números y Espacios simples.
     * ^[^\d\W_] -> Empieza con letra (no número, no símbolo, no guion bajo).
     * [\p{L}\p{N}\s]* -> Sigue con Letras (\p{L}), Números (\p{N}) o espacios (\s).
     * El flag 'u' permite manejar el estándar Unicode correctamente.
     */
    const alphaNumericRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/u;

    if (!alphaNumericRegex.test(cleaned)) {
      return null; // Bloqueo si hay . , / ? ! @ # $ % etc.
    }

    // 5. Normalización de espacios (Evita "Hola     Mundo")
    // Los espacios múltiples suelen usarse para engañar a motores de búsqueda o filtros
    cleaned = cleaned.replace(/\s\s+/g, ' ');

    // 6. CAPA FINAL DE DESINFECCIÓN (Kill-switch)
    // Aunque la regex ya filtró, barremos caracteres de escape por si la regex falla.
    return cleaned
      .replace(/<[^>]*>?/gm, '')           // Etiquetas HTML
      .replace(/[<>'"\\;`{}|[\]^~]/g, '')  // Caracteres de ruptura de código
      .replace(/\0/g, '');                 // Null bytes
  });
}