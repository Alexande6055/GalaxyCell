import * as Joi from 'joi';

/**
 * Esquema de validación para las variables de entorno de la aplicación.
 * Utiliza Joi para asegurar que todas las configuraciones críticas del sistema
 * (entorno, puerto, credenciales de base de datos, seguridad) estén cargadas correctamente.
 */
export const envValidationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
    SALTROUNDS: Joi.number().required(),
    TOKEN_SECRET: Joi.string().required(),
});
