import { getAluguelService } from "../services/aluguel.services.js"



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