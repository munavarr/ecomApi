import pool from "./postgre"

export interface dbOpeationSelect{
    filterField?:string;
    filterValue?:number;
    field?:string;
    table:string;    
}

export async function select(obj:dbOpeationSelect){
    
    if(obj.filterField && !obj.filterValue || !obj.filterField && obj.filterValue){
        return {message:"filter field or fielter value is missing "}
    }
    const query = `SELECT ${obj.field ? obj.field :'*'} FROM ${obj.table} ${obj.filterField ? `WHERE ${obj.filterField} = $1`:""}`
    const result = obj.filterValue ?  await pool.query(query,[obj.filterValue]): await pool.query(query)
    return result.rows
}
