import { db } from "../database/db.connection.js";

async function getJogoTitulo(name) {
    const resultado = await db.query('SELECT * FROM games WHERE name = $1;', [name]);
    return resultado
}

async function getJogos() {
    const jogos= await db.query(`SELECT * FROM games;`);
    return jogos.rows
}

async function createJogos(name,image,stockTotal,pricePerDay) {
    const resultado = await db.query(`
            INSERT INTO games (name,image,"stockTotal","pricePerDay") 
            VALUES ($1,$2,$3,$4) 
            RETURNING *; 
        `, [name,image,stockTotal,pricePerDay]);
         return resultado.rows[0];
}

const jogosRepository={
    getJogos,
    createJogos,
    getJogoTitulo
}
export default jogosRepository