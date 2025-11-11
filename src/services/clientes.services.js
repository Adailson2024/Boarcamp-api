import clientesRepository from "../repositories/cliente.repository.js";
import { minNumberErrors, conflictErrors } from "../errors/errors.js"
export async function getClientesService() {
    const resultado=await clientesRepository.getClientes()
    return resultado
}

export async function getClienteByIdService(id){
    const cliente = await clientesRepository.getClientesById(id);
    return cliente;
}

export async function createClientesService({name,phone,cpf}){
     const conflito = await clientesRepository.getClienteName(name)
        if (conflito.rowCount !== 0) throw conflictErrors("usuário")
            await clientesRepository.createClientes(name,phone,cpf)
}