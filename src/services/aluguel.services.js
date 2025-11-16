import aluguelRepository from "../repositories/aluguel.repository.js";
import jogosRepository from "../repositories/jogos.repository.js";
import clientesRepository from "../repositories/cliente.repository.js";
export async function getAluguelService() {
    const resultado=await aluguelRepository.getAluguel()
    return resultado
}

export async function createAluguelService({ customerId, gameId, daysRented }) {

  // --- VALIDAÇÕES 400 ---
  if (!daysRented || daysRented <= 0) return { type: 400 };
  if (!customerId || !gameId) return { type: 400 };

  // --- VALIDAÇÃO: GAME EXISTE ---
  const game = await jogosRepository.getJogoById(gameId);
  if (!game) return { type: 404 };

  // --- VALIDAÇÃO: CUSTOMER EXISTE ---
  const customer = await clientesRepository.getClientesById(customerId);
  if (!customer) return { type: 404 };

  // --- VALIDAÇÃO: ESTOQUE / DISPONIBILIDADE ---
  const rentalsOpen = await aluguelRepository.contadorDeAlugueisByGame(gameId);
  if (rentalsOpen >= game.stockTotal) {
    return { type: 422, message: "Este jogo não tem mais estoque disponível para aluguel." };
  }

  // --- REGRAS DE NEGÓCIO ---
  const rentDate = new Date();
  const originalPrice = daysRented * game.pricePerDay;
  const returnDate = null;
  const delayFee = null;

  await aluguelRepository.createAluguel({
    customerId,
    gameId,
    rentDate,
    daysRented,
    returnDate,
    originalPrice,
    delayFee
  });

  return { type: 201 };
}
