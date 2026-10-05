import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

export const getPool = () => {
  if (pool) {
    return pool
  }

  const config = useRuntimeConfig()
  const host = String(config.mysqlHost || process.env.MYSQL_HOST || '')
  const database = String(config.mysqlDatabase || process.env.MYSQL_DATABASE || '')
  const user = String(config.mysqlUser || process.env.MYSQL_USER || '')
  const password = String(config.mysqlPassword || process.env.MYSQL_PASSWORD || '')
  const port = Number(config.mysqlPort || process.env.MYSQL_PORT || 3306)

  if (!host || !database || !user) {
    throw createError({
      statusCode: 500,
      statusMessage: 'MySQL is not configured'
    })
  }

  pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 8,
    charset: 'utf8mb4'
  })

  return pool
}

export const query = async <T = mysql.RowDataPacket[]>(sql: string, params: unknown[] = []) => {
  const [rows] = await getPool().execute(sql, params)
  return rows as T
}
