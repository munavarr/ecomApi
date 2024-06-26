import { Pool } from 'pg';


const pool = new Pool({
                              user: 'postgres',
                              host: 'localhost',
                              database: 'postgres',
                              password: 'mnvpostgre123',
                            //   port: 5432, // Default PostgreSQL port
                            port : 8000
});

export default pool;  