import { Router } from "express";
import { clienteSchema } from "../schemas/jogos.schema.js";
import { validateSchema } from "../middlewares/validateSchema.middlewares.js";
import { getClientes,createClientes, getClientesById } from "../controllers/clientes.controllers.js";

const clientesRouter=Router()
clientesRouter.get("/", getClientes)
clientesRouter.get("/:id", getClientesById)
clientesRouter.post("/",validateSchema(clienteSchema),createClientes)
export default clientesRouter