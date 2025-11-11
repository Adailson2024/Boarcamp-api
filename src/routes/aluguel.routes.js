import { Router } from "express";
import { getAlugueis } from "../controllers/aluguel.controllers.js";


const alugueisRouter=Router()
alugueisRouter.get("/", getAlugueis)

export default alugueisRouter