import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  STAGE: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_VALIDITY: Joi.number().default(3600).required(),
});
