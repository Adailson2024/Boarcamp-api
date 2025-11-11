import jogosRepository from "../repositories/jogos.repository.js"
import { minNumberErrors, conflictErrors } from "../errors/errors.js"

export async function getJogosService(){
    const resultado=await jogosRepository.getJogos()
    return resultado
}

export async function createJogosService({name,image,stockTotal,pricePerDay}){
     if (stockTotal < 1 && pricePerDay <1) throw minNumberErrors()
    const conflito = await jogosRepository.getJogoTitulo(name)
            if (conflito.rowCount !== 0) throw conflictErrors("jogo")
            
            await jogosRepository.createJogos(name,image,stockTotal,pricePerDay)
}