// order-utils.ts

/**
 * Genera la parte de la fecha en formato YYYYMMDD
 */
export const getFormattedDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
};

/**
 * Construye el string final basado en el tipo, fecha y correlativo
 */
export const buildOrderCode = (type: string, dateStr: string, sequence: number): string => {
    const prefix = type === 'garantia' ? 'G' : 'E';
    const paddedSequence = sequence.toString().padStart(3, '0');
    return `${prefix}-${dateStr}-${paddedSequence}`;
};