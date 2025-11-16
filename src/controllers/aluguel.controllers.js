import { getAluguelService,createAluguelService,getAluguelByIdService } from "../services/aluguel.services.js"


export async function createAluguelController(req, res) {
  const { customerId, gameId, daysRented } = req.body;

  const result = await createAluguelService({ customerId, gameId, daysRented });

    if (result.type !== 201) {
        // Retorna o status code e a mensagem de erro detalhada
        return res.status(result.type).send({ message: result.message || "Erro desconhecido." });
    }

    return res.sendStatus(201)
}


function AluguelFormatado(resultado) {
  return resultado.map(row => {
    const {
      id,
      customerId,
      gameId,
      rentDate,
      daysRented,
      returnDate,
      originalPrice,
      delayFee,
      customer_id,
      customer_name,
      game_id,
      game_name
    } = row;

    return {
      id,
      customerId,
      gameId,
      // Transforma a data do banco (ISO, T-SQL) para a string 'YYYY-MM-DD'
      rentDate: new Date(rentDate).toISOString().split('T')[0], 
      daysRented,
      returnDate,
      originalPrice,
      delayFee,
      customer: { 
        id: customer_id,
        name: customer_name
      },
      game: { 
        id: game_id,
        name: game_name
      }
    };
  });
}

export async function getAlugueis(req, res) {
    
    const resultadosAchatados = await getAluguelService(req.body);

    const resultadosFormatados = AluguelFormatado(resultadosAchatados);
            
    res.status(200).send(resultadosFormatados);
}

export async function returnAluguelController(req, res) {
  const { id } = req.params;

 // O id deve ser um número inteiro positivo
 const aluguelId = parseInt(id);
 if (isNaN(aluguelId) || aluguelId <= 0) {
  return res.status(400).send({ message: "ID de aluguel inválido." });
 }

 const result = await returnAluguelService(aluguelId);

 // Trata os erros retornados pelo Service
 if (result.type !== 200) {
  return res.status(result.type).send({ message: result.message || "Erro desconhecido ao devolver." });
 }

// Resposta de sucesso conforme a regra de negócio
 return res.sendStatus(200);
}

export async function getAluguelByIdController(req, res) {
 const { id } = req.params;
 
 const aluguelId = parseInt(id);
 if (isNaN(aluguelId) || aluguelId <= 0) {
  return res.status(400).send({ message: "ID de aluguel inválido." });
 }

 const result = await getAluguelByIdService(aluguelId);
 
 if (result.type === 404) {
  return res.status(404).send({ message: result.message });
 }

 // Formata o resultado único
 const resultadoFormatado = AluguelFormatado(result.data);
 
 return res.status(200).send(resultadoFormatado);
}