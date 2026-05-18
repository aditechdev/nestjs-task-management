import * as Joi from 'joi';

const isRailway = !!process.env.RAILWAY_ENVIRONMENT;

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  STAGE: Joi.string().default(isRailway ? 'prod' : 'dev'),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_VALIDITY: Joi.number().default(3600),
});
