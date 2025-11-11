import { createJogosService, getJogosService } from "../services/jogos.services.js"

export async function getJogos(req,res) {
    const resultado = await getJogosService(req.body)
           
             res.status(201).send(resultado)
}

export async function createJogos(req,res) {
    const resultado = await createJogosService(req.body)
           
             res.status(201).send(resultado)
}