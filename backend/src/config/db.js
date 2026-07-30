const sql = require('mssql/msnodesqlv8')

const configuracion = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        trustedConnection: true,
        trustServerCertificate: true
    }
}

async function  conectarBaseDatos() {
    try {
        const conexion = await sql.connect(configuracion)

        console.log('Conexión a SQL Server realizada correctamente')

        return conexion
    } catch (error) {
        console.error(
            'Error al conectar con SQL Server',
            error.message
        )

        throw error
    }
}

module.exports = {
    sql,
    conectarBaseDatos
}