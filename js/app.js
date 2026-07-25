const formularioGasto = document.getElementById('formularioGasto')
const descripcion = document.getElementById('descripcion')
const categoria = document.getElementById('categoria')
const monto = document.getElementById('monto')
const fecha = document.getElementById('fecha')
const metodoPago = document.getElementById('metodoPago')
const nota = document.getElementById('nota')
const mensajeFormulario = document.getElementById('mensajeFormulario')

let gastos = JSON.parse(localStorage.getItem('gastos')) || []

formularioGasto.addEventListener('submit', function (e) {
    e.preventDefault()

    const nuevoGasto = {
        id: Date.now(),
        descripcion: descripcion.value.trim(),
        categoria: categoria.value,
        monto: Number(monto.value),
        fecha: fecha.value,
        metodoPago: metodoPago.value,
        nota: nota.value.trim()
    }

    gastos.push(nuevoGasto)

    localStorage.setItem('gastos', JSON.stringify(gastos))

    console.log(gastos)

    mensajeFormulario.textContent = 'Gasto registrado correctamente.'

    formularioGasto.reset()
})



