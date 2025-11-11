import { getAluguelService } from "../services/aluguel.services.js"


export async function getAlugueis(req,res) {
    const resultado = await getAluguelService(req.body)
               
                 res.status(200).send(resultado)
}