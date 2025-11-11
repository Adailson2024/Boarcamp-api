import { Router } from "express";
import { createJogos, getJogos } from "../controllers/jogos.controllers.js";
import {jogoSchema} from "../schemas/jogos.schema.js"
import { validateSchema } from "../middlewares/validateSchema.middlewares.js"

const jogosRouter=Router()
jogosRouter.get("/", getJogos)
jogosRouter.post("/", validateSchema(jogoSchema),createJogos)
export default jogosRouter