import Express, { Router, Request, Response, request } from "express";
import pool from "../../db/postgre";

const categories = Express();


categories.post('/loginwithotp', async (request, res) => {
    try {
   
    } catch (error) {
    console.error('Internal server error', error);
    res.status(500).send({ Message: 'Internal Server Error' });
    }
    });
    
    
    
    export default categories