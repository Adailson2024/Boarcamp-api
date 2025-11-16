import Joi from "joi";

export const jogoSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().required(),
  stockTotal: Joi.number().required(),
  pricePerDay: Joi.number().required()
});

export const clienteSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  cpf: Joi.string().required(),
});

export const aluguelSchema=Joi.object({
  customerId: Joi.string().required(),
  gameId: Joi.string().required(),
  daysRented: Joi.string().required()
})