import aluguelRepository from "../repositories/aluguel.repository.js";
import jogosRepository from "../repositories/jogos.repository.js";
import clientesRepository from "../repositories/cliente.repository.js";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export async function getAluguelService() {
    const resultado=await aluguelRepository.getAluguel()
    return resultado
}

export async function getAluguelByIdService(aluguelId) {
 const aluguel = await aluguelRepository.getAluguelByIdDetailed(aluguelId);
 if (!aluguel) {
  return { type: 404, message: "Aluguel não encontrado." };
 }
 return { type: 200, data: aluguel };
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

export async function returnAluguelService(aluguelId) {
 // 1. Buscar o aluguel e os dados do jogo (para calcular a multa)
 const aluguel = await aluguelRepository.getAluguelName(aluguelId);
 
 // REGRA 1: Verificar se o aluguel existe (404)
 if (!aluguel) {
  return { type: 404, message: "Aluguel não encontrado." };
 }

 // REGRA 2: Verificar se o aluguel já foi devolvido (422)
 if (aluguel.returnDate) {
  return { type: 422, message: "Este aluguel já foi devolvido." };
 }
 
 // REGRA 3: Calcular data de devolução e multa
 const returnDate = new Date(); // Data e hora atuais do retorno

 // Data de aluguel e dias alugados
 const rentDate = new Date(aluguel.rentDate);
 const daysRented = aluguel.daysRented;
 
 // Preço por dia do jogo (precisa vir do JOIN no Repository)
 const pricePerDay = aluguel.pricePerDay;

 // Cálculo da data limite de devolução
 // A data limite é a data de aluguel + dias alugados
 const expectedReturnDate = new Date(rentDate.getTime() + daysRented * DAY_IN_MS);
 
 // Remove o componente de hora da data de retorno para comparação diária
 const returnDateOnly = new Date(returnDate.getFullYear(), returnDate.getMonth(), returnDate.getDate());
 const expectedDateOnly = new Date(expectedReturnDate.getFullYear(), expectedReturnDate.getMonth(), expectedReturnDate.getDate());

 // Calcula a diferença em milissegundos entre o retorno e o esperado
 const diffTime = returnDateOnly.getTime() - expectedDateOnly.getTime();

 // Calcula a diferença em dias (arredondado para baixo para evitar frações)
 const delayDays = Math.floor(diffTime / DAY_IN_MS);

 let delayFee = null;

 // Se houver atraso (delayDays > 0), calcula a multa
 if (delayDays > 0) {
  // Multa = dias de atraso * preço por dia
  delayFee = delayDays * pricePerDay; 
 }
 
 // REGRA 4: Atualizar o aluguel no banco de dados
 await aluguelRepository.updateAluguel({
  id: aluguelId,
  returnDate,
  delayFee
 });

 return { type: 200 };
}

export async function deleteAluguelService(aluguelId) {
  // 1. Verificar se o aluguel existe e o status de devolução
  const aluguel = await aluguelRepository.getAluguelById(aluguelId); 

  if (!aluguel) {
    return { type: 404, message: "Aluguel não encontrado para exclusão." };
  }

  // Regra de Negócio: Só é possível excluir se já foi devolvido
  if (!aluguel.returnDate) {
    return { type: 400, message: "Aluguel deve ser devolvido antes de ser excluído." };
  }

  // 2. Excluir no banco
  await aluguelRepository.deleteAluguel(aluguelId);

  // 204 No Content é o padrão para DELETE bem sucedido
  return { type: 204 }; 
}
