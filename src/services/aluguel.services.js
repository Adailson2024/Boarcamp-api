import aluguelRepository from "../repositories/aluguel.repository.js";
export async function getAluguelService() {
    const resultado=await aluguelRepository.getAluguel()
    return resultado
}