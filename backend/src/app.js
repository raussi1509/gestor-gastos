const express = require('express')
const cors = require('cors')
require('dotenv').config()

const { conectarBaseDatos } = require('./config/db')
const gastosRoutes = require('./routes/gastos.routes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/gastos', gastosRoutes)

app.get('/', function (req, res) {
    res.json({
        mensaje: 'API del Gestor de Gastos funcionando correctamente'
    })
})

conectarBaseDatos()

const puerto = process.env.PORT || 3000

async function iniciarServidor() {
    try {
        await conectarBaseDatos()

        app.listen(puerto, function () {
            console.log(`Servidor ejecutándose en http://localhost:${puerto}`)
        })
    } catch (error) {
        console.error('No fue posible iniciar el servidor.')
    }
}

iniciarServidor()