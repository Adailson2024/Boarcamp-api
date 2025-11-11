import { db } from "../database/db.connection.js";

async function getAluguelName(gameId) {
    const resultado = await db.query('SELECT * FROM rentals WHERE gameId = $1;', [gameId]);
    return resultado
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

async function createAluguel({customerId, gameId, rentDate, daysRented, originalPrice}) {
    const resultado= await db.query(
        `
      INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice", "returnDate", "delayFee")
      VALUES ($1, $2, $3, $4, $5, NULL, NULL)`, [customerId, gameId, rentDate, daysRented, originalPrice]);
    
    

    return resultado
}

export async function deleteAluguel(id) {
    await db.query(`DELETE FROM rentals WHERE id=$1;`,[1])
}



const aluguelRepository={
    getAluguelName,
    getAluguel,
    createAluguel,
    deleteAluguel
}

export default aluguelRepository