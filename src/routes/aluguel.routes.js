import { Router } from "express";
import { getAlugueis, createAluguelController ,returnAluguelController,getAluguelByIdController,deleteAluguelController} from "../controllers/aluguel.controllers.js";


const alugueisRouter=Router()
alugueisRouter.get("/", getAlugueis)
alugueisRouter.get("/:id", getAluguelByIdController) 
alugueisRouter.post("/", createAluguelController)
alugueisRouter.post("/:id/return", returnAluguelController)
alugueisRouter.delete("/:id", deleteAluguelController)

export default alugueisRouter