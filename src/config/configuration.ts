import * as Joi from 'joi';

export const ValidationSchema = Joi.object({
  PORT: Joi.number().default(8080),
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_PORT: Joi.number().default(3306),
  DATABASE_USERNAME: Joi.string().default('root'),
  DATABASE_PASSWORD: Joi.string().default(''),
  DATABASE_NAME: Joi.string().default('TicTacToe'),
});
