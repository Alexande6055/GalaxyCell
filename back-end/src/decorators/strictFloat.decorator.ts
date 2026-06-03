import { Transform } from 'class-transformer';

/**
 * Decorador de transformación para sanitizar, validar y normalizar números decimales (floats) de manera estricta.
 * 
 * Este decorador realiza las siguientes acciones:
 * 1. Comprueba si el valor de entrada no es nulo o vacío.
 * 2. Limpia los espacios en blanco laterales.
 * 3. Valida mediante una expresión regular estricta que contenga solo dígitos y opcionalmente un separador decimal (punto o coma).
 * 4. Si el formato es inválido, retorna `NaN` (para que validadores como `@IsNumber` o `@Min` lo intercepten).
 * 5. Normaliza la coma a punto decimal para JS.
 * 6. Convierte a flotante y redondea el valor a un máximo de 2 decimales.
 * 
 * @returns {PropertyDecorator} Un transformador de class-transformer para normalizar valores decimales.
 */
export function StrictFloat() {
    return Transform(({ value }) => {
        // 1. Si no hay valor, devolverlo para que @IsNotEmpty actúe
        if (value === null || value === undefined || value === '') return value;

        // 2. Convertir a string y limpiar solo espacios de los lados
        const rawValue = String(value).trim();

        // 3. REGEX ESTRICTA: 
        // ^[0-9]+        -> Empieza con uno o más números
        // ([\.,][0-9]+)? -> Opcionalmente sigue con UNA coma o UN punto y más números
        // $              -> Fin de la cadena
        const strictRegex = /^[0-9]+([\.,][0-9]+)?$/;

        if (!strictRegex.test(rawValue)) {
            // Si no cumple el formato exacto, devolvemos algo que no sea un número válido
            // para que @IsNumber o @Min lo capturen como error.
            return NaN;
        }

        // 4. Normalización para el motor de JS (Coma a Punto)
        let normalized = rawValue.replace(',', '.');

        // 5. Conversión y Redondeo a 2 decimales
        const num = parseFloat(normalized);

        // Retornamos el número redondeado (esto lo convierte en tipo Number)
        return parseFloat(num.toFixed(2));
    });
}