import { getAluguelService,createAluguelService } from "../services/aluguel.services.js"


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