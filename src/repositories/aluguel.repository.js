import { db } from "../database/db.connection.js";


async function getAluguelName(gameId) {
    const resultado = await db.query('SELECT * FROM rentals WHERE gameId = $1;', [gameId]);
    return resultado
}

async function contadorDeAlugueisByGame(gameId) {
  const result = await db.query(
    `SELECT COUNT(*) FROM rentals WHERE "gameId" = $1 AND "returnDate" IS NULL`,
    [gameId]
  );
  return Number(result.rows[0].count);
}

async function getAluguel() {
    const aluguel= await db.query(` SELECT
        r.id, r."customerId", r."gameId", r."rentDate", r."daysRented", 
        r."returnDate", r."originalPrice", r."delayFee",
        c.id AS customer_id, c.name AS customer_name,
        g.id AS game_id, g.name AS game_name
      FROM
        rentals r
      JOIN customers c ON r."customerId" = c.id
      JOIN games g ON r."gameId" = g.id
      ORDER BY r.id DESC;`);
    return aluguel.rows
}

async function createAluguel({customerId, gameId, rentDate, daysRented,returnDate, originalPrice,delayFree}) {
    const resultado= await db.query(
        `
      INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice", "returnDate", "delayFee")
      VALUES ($1, $2, $3, $4, $5, $6, $7)`, [customerId, gameId, rentDate, daysRented,returnDate, originalPrice,delayFree]);
    
    

    return resultado
}

export async function deleteAluguel(id) {
    await db.query(`DELETE FROM rentals WHERE id=$1;`,[id])
}



const aluguelRepository={
    getAluguelName,
    getAluguel,
    createAluguel,
    deleteAluguel, 
    contadorDeAlugueisByGame
}

export default aluguelRepository