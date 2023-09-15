import { Connection, Pool, PoolClient, QueryResult } from "pg";

// Enums
export enum Statement {
  WHERE = "WHERE",
  NOT = "NOT",
  OR = "OR",
  AND = "AND",
  IF = "IF",
  BETWEEN = "BETWEEN",
  LIKE = "LIKE",
  ILIKE = "ILIKE",
  EQUALS = "=",
  IS_NULL = "IS NULL",
  IS_NOT_NULL = "IS NOT NULL",
  EXISTS = "EXISTS",
  ANY = "ANY",
  ALL = "ALL",
}



export class Credentials
{
    host: string;
    database: string;
    username: string;
    password: string;
    port: number;

    constructor (host: string, database: string, username: string, password: string, port: number)
    {
        this.host = host || "localhost";
        this.database = database;
        this.username = username;
        this.password = password;
        this.port = port || 5432;
    };
};

export class ConnectionUrl
{
    url: string;

    constructor (url: string)
    {
        this.url = url;
    };
};

export class Condition 
{
    condition: string;
    
    constructor (tableCondition: Statement, column: string, columnCondition: Statement, comparator?: string)
    {
        this.condition = `${tableCondition} ${column} ${columnCondition}${comparator ? " '" + comparator + "'": ""}`;         
    }
}

export class ResultSet implements QueryResult
{
    query: string;
    command: string;
    rows: any[];
    rowCount: number;
    oid: any;
    fields: any[];

    constructor (query: string, result: QueryResult)
    {
        this.rows = result.rows;
        this.command = result.command;
        this.rowCount = result.rowCount;
        this.oid = result.oid;
        this.fields = result.fields;
        this.query = query;
    }

}

export class PSQL
{
    private pool: Pool;

    constructor (credentials: Credentials | ConnectionUrl)
    {
        if (credentials instanceof Credentials) {
            this.pool = new Pool({
                host: credentials.host,
                database: credentials.database,
                user: credentials.username,
                password: credentials.password,
                port: credentials.port
            });
        } else if (credentials instanceof ConnectionUrl) {
            this.pool = new Pool({ connectionString: credentials.url });
        } else {
            throw new Error ("Invalid parameters");
        }
    };


    /**
     * Run a select query on a table in the connected database
     * @param table Target table to select from
     * @param columns Columns you would like to select from the table
     * @param condition Condition of the select statement
     * @returns Results of the query
     */
    async select (table: string, columns: string[] | string, condition?: Condition): Promise<ResultSet>
    {
        try {
            // Create client connection
            const connection: PoolClient = await this.pool.connect();

            // Single column: string
            if (typeof columns === "string") {
                // Query string
                const query: string = `SELECT ${columns} FROM ${table}${condition ? " " + condition.condition : ""};`;

                // Query database
                const result: QueryResult = await connection.query(query);
            
                // Release the client connection back to the pool
                connection.release();

                // Return ResultSet
                const resultSet: ResultSet = new ResultSet(query, result);
                return resultSet;
            
            // Multi column: string[]
            } else if (Array.isArray(columns) && columns.every(col => typeof col === "string")) {
                // Query string
                const query: string = `SELECT ${columns.join(",")} FROM ${table}${condition ? " " + condition.condition : ""};`;

                // Query database
                const result: QueryResult = await connection.query(query);
            
                // Release the client connection back to the pool
                connection.release();

                // Return ResultSet
                const resultSet: ResultSet = new ResultSet(query, result);
                return resultSet;
            
            // Invalid column
            } else {
                throw new Error("Invalid column parameters");
            }
        
        // Catch errors
        } catch (err: any) {
            throw new Error("Error:" + err);
        }
    };

    async insert (table: string, columns: string[] | string, values: string[] | string): Promise<ResultSet>
    {
        try {
            // Create client connection
            const connection: PoolClient = await this.pool.connect();

            // Ensure matching column and value types
            // Single column and value: string
            if (typeof columns === "string" && typeof values === "string") {
                // Query string
                const query: string = `INSERT INTO ${table} (${columns}) VALUES ('${values}');`;

                // Query database
                const result: QueryResult = await connection.query(query);

                // Release connection back to the pool
                connection.release();
                
                // Return ResultSet
                const resultSet: ResultSet = new ResultSet(query, result);
                return resultSet;


            // Multiple columns and values: string[]
            } else if (Array.isArray(columns) && columns.every(col => typeof col === "string") && Array.isArray(values) && values.every(col => typeof col === "string")) {
                // Format values array
                for (let i = 0; i < values.length; i++) {
                    values[i] = `'${values[i]}'`;
                }

                // Query string
                const query: string = `INSERT INTO ${table} (${columns.join(",")}) VALUES (${values.join(",")});`;

                // Query database
                const result: QueryResult = await connection.query(query);

                // Release connection back to the pool
                connection.release();
                
                // Return ResultSet
                const resultSet: ResultSet = new ResultSet(query, result);
                return resultSet;
            
            // Un-matching types
            } else {
                throw new Error("Invalid column/value types");
            }

        // Catch errors
        } catch (err) {
            throw new Error("Error: " + err);
        }
    }

    /**
     * Drops a table from a database
     * @param table Name(s) of the target table
     * @returns Result of the query
     */
    async drop (table: string | string[]): Promise<ResultSet[]>
    {
        try {
            // Create client connection
            const connection: PoolClient = await this.pool.connect();

            // Single table: string
            if (typeof table === "string") {
                // Query string
                const query: string = `DROP TABLE ${table}`;

                // Query database
                const result: QueryResult = await connection.query(query);

                // Release the client connection back to the pool
                connection.release();

                // Return ResultSet
                const resultSet: ResultSet = new ResultSet(query, result);
                return [ resultSet ];

            // Multiple tables: string[]
            } else if (Array.isArray(table) && table.every(col => typeof col === "string")) {
                // List of query results
                const resultSets: ResultSet[] = []; 

                // For each table in array
                for (const name of table) {
                    // Query string
                    const query: string = `DROP TABLE ${name}`;

                    // Query database
                    const result: QueryResult = await connection.query(query);

                    // Create ResultSet
                    const resultSet: ResultSet = new ResultSet(query, result);
                    // Add result to results
                    resultSets.push(resultSet);
                };

                // Release the client connection back to the pool
                connection.release();

                // Return ResultSet
                return resultSets;


            // Invalid table
            } else {
                throw new Error("Invalid table parameters");
            }
        // Catch errors
        } catch (err) {
            throw new Error("Error: " + err);
        }
    }
};