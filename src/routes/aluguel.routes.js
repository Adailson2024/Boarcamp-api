import { Router } from "express";
import { getAlugueis, createAluguelController } from "../controllers/aluguel.controllers.js";


const alugueisRouter=Router()
alugueisRouter.get("/", getAlugueis)
alugueisRouter.post("/", createAluguelController)

export default alugueisRouter