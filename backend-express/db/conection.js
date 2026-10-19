import sql from 'mssql';

const dbConfig = {
  user:'sig',
  password:'cc2008DC@',
  server: '172.16.10.15',
  database: 'pruebaTecnica',
  options: {
    encrypt: true,
    trustServerCertificate: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

const getConnection = async () => {
  try {
    const pool = await sql.connect(dbConfig);
    return pool;
  } catch (error) {
    console.error('Error de conexión a SQL Server:', error);
    throw error;
  }
};

export { sql, getConnection };