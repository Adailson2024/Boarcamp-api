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

  
  if (!daysRented || daysRented <= 0) return { type: 400 };
  if (!customerId || !gameId) return { type: 400 };

  
  const game = await jogosRepository.getJogoById(gameId);
  if (!game) return { type: 404 };

  
  const customer = await clientesRepository.getClientesById(customerId);
  if (!customer) return { type: 404 };

  
  const rentalsOpen = await aluguelRepository.contadorDeAlugueisByGame(gameId);
  if (rentalsOpen >= game.stockTotal) {
    return { type: 422, message: "Este jogo não tem mais estoque disponível para aluguel." };
  }

  
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
 
 const aluguel = await aluguelRepository.getAluguelByIdForReturn(aluguelId);
 
 
 if (!aluguel) {
  return { type: 404, message: "Aluguel não encontrado." };
 }

 
 if (aluguel.returnDate) {
  return { type: 422, message: "Este aluguel já foi devolvido." };
 }
 
 
 const returnDate = new Date(); 

 
 const rentDate = new Date(aluguel.rentDate);
 const daysRented = aluguel.daysRented;
 
 
 const pricePerDay = aluguel.pricePerDay;

 
 const expectedReturnDate = new Date(rentDate.getTime() + daysRented * DAY_IN_MS);
 
 
 const returnDateOnly = new Date(returnDate.getFullYear(), returnDate.getMonth(), returnDate.getDate());
 const expectedDateOnly = new Date(expectedReturnDate.getFullYear(), expectedReturnDate.getMonth(), expectedReturnDate.getDate());

 
 const diffTime = returnDateOnly.getTime() - expectedDateOnly.getTime();

 const delayDays = Math.floor(diffTime / DAY_IN_MS);

 let delayFee = null;

 
 if (delayDays > 0) {
  delayFee = delayDays * pricePerDay; 
 }
 
 await aluguelRepository.updateAluguel({
  id: aluguelId,
  returnDate,
  delayFee
 });

 return { type: 200 };

 
}

export async function deleteAluguelService(aluguelId) {

 const aluguel = await aluguelRepository.getAluguelByIdDetailed(aluguelId); 

 if (!aluguel) {
  return { type: 404, message: "Aluguel não encontrado para exclusão." };
 }

 if (!aluguel.returnDate) {
  return { type: 400, message: "Aluguel deve ser devolvido antes de ser excluído." };
 }

 
 await aluguelRepository.deleteAluguel(aluguelId);

 
 return { type: 204 }; 
}
