const formularioGasto = document.getElementById('formularioGasto')
const descripcion = document.getElementById('descripcion')
const categoria = document.getElementById('categoria')
const monto = document.getElementById('monto')
const fecha = document.getElementById('fecha')
const metodoPago = document.getElementById('metodoPago')
const nota = document.getElementById('nota')
const mensajeFormulario = document.getElementById('mensajeFormulario')
const listaGastos = document.getElementById('listaGastos')

let gastos = JSON.parse(localStorage.getItem('gastos')) || []

function mostrarGatos() {
    listaGastos.innerHTML = ''

    if (gastos.length === 0) {
        listaGastos.innerHTML = '<p>No hay gastos registrados.</p>'
        return
    }

    for (const gasto of gastos) {
        const tarjeta = document.createElement('article')

        tarjeta.classList.add('tarjeta-gasto')

        tarjeta.innerHTML = `
            <h3>${gasto.descripcion}</h3>
            <p><strong>Categoría:</strong> ${gasto.categoria}</p>
            <p><strong>Monto:</strong> RD$${gasto.monto.toFixed(2)}</p>
            <p><strong>Fecha:</strong> ${gasto.fecha}</p>
            <p><strong>Método de pago:</strong> ${gasto.metodoPago}</p>
            <p><strong>Nota:</strong> ${gasto.nota || 'Sin nota'}</p>`

            listaGastos.appendChild(tarjeta)
    }
}

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

    mostrarGatos()

    mensajeFormulario.textContent = 'Gasto registrado correctamente.'

    formularioGasto.reset()
})

mostrarGatos()



