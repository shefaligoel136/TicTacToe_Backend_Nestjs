import * as Joi from 'joi';

export const ValidationSchema = Joi.object({
  PORT: Joi.number().default(8080),
  MONGO_URI: Joi.string()
    .uri()
    .default('mongodb://localhost:27017/?replicaSet=rs0'),
});
