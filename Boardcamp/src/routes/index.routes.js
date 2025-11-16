import { Router } from "express"
import jogosRouter from "./jogos.routes.js";
import clientesRouter from "./clientes.routes.js";
const routes=Router();

routes.use('/jogos', jogosRouter);
routes.use('/clientes', clientesRouter); 

routes.get('/', (req, res) => {
    res.send('API de Receitas online!');
});

export default routes;