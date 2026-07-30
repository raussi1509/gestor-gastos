const express = require('express')
const { sql, conectarBaseDatos } = require('../config/db')

const router = express.Router()

router.get('/', async function (req, res) {
    try {
        const conexion = await conectarBaseDatos()

        const resultado = await conexion
        .request()
        .query(`SELECT Id, Descripcion, Categoria, Monto,
                    Fecha, MetodoPago, Nota
                FROM Gastos
                ORDER BY Fecha DESC, Id DESC`)
        
        res.json(resultado.recordset)
    } catch (error) {
        console.error('Error al consultar gastos:', error.message)

        res.status(500).json({
            mensaje: 'No fue posible obtener los gastos.'
        })
    }
})

router.post('/', async function (req, res) {
    try {
        const {
            descripcion,
            categoria,
            monto,
            fecha,
            metodoPago,
            nota
        } = req.body

        const conexion = await conectarBaseDatos()

        const resultado = await conexion
            .request()
            .input('Descripcion', sql.NVarChar(150), descripcion)
            .input('Categoria', sql.NVarChar(50), categoria)
            .input('Monto', sql.Decimal(10, 2), monto)
            .input('Fecha', sql.Date, fecha)
            .input('MetodoPago', sql.NVarChar(50), metodoPago)
            .input('Nota', sql.NVarChar(300), nota || null)
            .query(`
                INSERT INTO Gastos (
                    Descripcion,
                    Categoria,
                    Monto,
                    Fecha,
                    MetodoPago,
                    Nota
                )
                OUTPUT INSERTED.*
                VALUES (
                    @Descripcion,
                    @Categoria,
                    @Monto,
                    @Fecha,
                    @MetodoPago,
                    @Nota
                )
            `)

        res.status(201).json(resultado.recordset[0])
    } catch (error) {
        console.error('Error al registrar gasto:', error.message)

        res.status(500).json({
            mensaje: 'No fue posible registrar el gasto.'
        })
    }
})

router.put('/:id', async function (req, res) {
    try {
        const id = Number(req.params.id)

        const {
            descripcion,
            categoria,
            monto,
            fecha,
            metodoPago,
            nota
        } = req.body

        const conexion = await conectarBaseDatos()

        const resultado = await conexion
            .request()
            .input('Id', sql.Int, id)
            .input('Descripcion', sql.NVarChar(150), descripcion)
            .input('Categoria', sql.NVarChar(50), categoria)
            .input('Monto', sql.Decimal(10, 2), monto)
            .input('Fecha', sql.Date, fecha)
            .input('MetodoPago', sql.NVarChar(50), metodoPago)
            .input('Nota', sql.NVarChar(300), nota || null)
            .query(`
                UPDATE Gastos
                SET
                    Descripcion = @Descripcion,
                    Categoria = @Categoria,
                    Monto = @Monto,
                    Fecha = @Fecha,
                    MetodoPago = @MetodoPago,
                    Nota = @Nota
                OUTPUT INSERTED.*
                WHERE Id = @Id
            `)

        if (resultado.recordset.length === 0) {
            return res.status(404).json({
                mensaje: 'Gasto no encontrado.'
            })
        }

        res.json(resultado.recordset[0])
    } catch (error) {
        console.error('Error al actualizar gasto:', error.message)

        res.status(500).json({
            mensaje: 'No fue posible actualizar el gasto.'
        })
    }
})

router.delete('/:id', async function (req, res) {
    try {
        const id = Number(req.params.id)

        const conexion = await conectarBaseDatos()

        const resultado = await conexion
            .request()
            .input('Id', sql.Int, id)
            .query(`
                DELETE FROM Gastos
                OUTPUT DELETED.*
                WHERE Id = @Id
            `)

        if (resultado.recordset.length === 0) {
            return res.status(404).json({
                mensaje: 'Gasto no encontrado.'
            })
        }

        res.json({
            mensaje: 'Gasto eliminado correctamente.',
            gasto: resultado.recordset[0]
        })
    } catch (error) {
        console.error('Error al eliminar gasto:', error.message)

        res.status(500).json({
            mensaje: 'No fue posible eliminar el gasto.'
        })
    }
})

module.exports = router