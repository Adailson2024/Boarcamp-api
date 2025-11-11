import { getClientesService } from "../services/clientes.services.js"
import { createClientesService,getClienteByIdService } from "../services/clientes.services.js"
export async function getClientes(req,res) {
    const resultado = await getClientesService(req.body)
           
             res.status(200).send(resultado)
}

export async function getClientesById(req,res) {
    const {id}=req.params;
    const cliente = await getClienteByIdService(id);
    if (!cliente) {
    return res.status(404).json({ 
        message: `Cliente com ID ${id} não encontrado.` 
    });
  }
  return res.status(200).json(cliente);
}

export async function createClientes(req,res) {
    const resultado = await createClientesService(req.body)
             res.status(201).send(resultado)
}