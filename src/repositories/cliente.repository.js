import { db } from "../database/db.connection.js";

async function getClienteName(name) {
    const resultado = await db.query('SELECT * FROM customers WHERE name = $1;', [name]);
    return resultado
}

async function getClientes() {
    const jogos= await db.query(`SELECT * FROM customers;`);
    return jogos.rows
}

async function getClientesById(custumerId) {
    const resultado = await db.query(`
        SELECT 
            *
        FROM 
            customers
        WHERE 
            id = $1;
    `, [custumerId]);

    return resultado.rows[0] || null;
}

async function createClientes(name,phone,cpf) {
    const resultado = await db.query(`
            INSERT INTO customers (name,phone,cpf) 
            VALUES ($1,$2,$3) 
            RETURNING *; 
        `, [name,phone,cpf]);
         return resultado.rows[0];
}


const clientesRepository={
getClienteName,
getClientes,
getClientesById,
createClientes
}

export default clientesRepository