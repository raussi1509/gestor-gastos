const formularioGasto = document.getElementById('formularioGasto')
const descripcion = document.getElementById('descripcion')
const categoria = document.getElementById('categoria')
const monto = document.getElementById('monto')
const fecha = document.getElementById('fecha')
const metodoPago = document.getElementById('metodoPago')
const nota = document.getElementById('nota')
const mensajeFormulario = document.getElementById('mensajeFormulario')
const listaGastos = document.getElementById('listaGastos')
const botonRegistrar = document.getElementById('botonRegistrar')

let gastos = JSON.parse(localStorage.getItem('gastos')) || []

let idGastoEditar = null

function mostrarGastos() {
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
            <p><strong>Nota:</strong> ${gasto.nota || 'Sin nota'}</p>
            <button type="button" class="boton-editar" data-id="${gasto.id}">Editar</button>
            <button type="button" class="boton-eliminar" data-id="${gasto.id}">Eliminar</button>`

            listaGastos.appendChild(tarjeta)
    }

    const botonesEditar = document.querySelectorAll('.boton-editar')

    for (const boton of botonesEditar) {
        boton.addEventListener('click', function () {
            const id = Number(boton.dataset.id)

            cargarGastoEnFormulario(id)            
        })
    }

    const botonesEliminar = document.querySelectorAll ('.boton-eliminar')

    for (const boton of botonesEliminar) {
        boton.addEventListener('click', function () {
            const id = Number(boton.dataset.id)

            eliminarGasto(id)
        })
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

    if (idGastoEditar === null) {
        gastos.push(nuevoGasto)

        mensajeFormulario.textContent = 'Gasto registrado correctamente.'
    } else {
        const posicion = gastos.findIndex (function (gasto) {
            return gasto.id === idGastoEditar
        })

        if (posicion !== -1) {
            nuevoGasto.id = idGastoEditar
            gastos[posicion] = nuevoGasto
        }

        mensajeFormulario.textContent = 'Gasto actualizado correctamente.'

        idGastoEditar = null 
        botonRegistrar.textContent = 'Registrar gasto'
    }

    localStorage.setItem('gastos', JSON.stringify(gastos))

    mostrarGastos()

    formularioGasto.reset()
})

mostrarGastos()

function cargarGastoEnFormulario(id) {
    const gastoEncontrado = gastos.find(function (gasto) {
        return gasto.id === id
    })

    if (!gastoEncontrado) {
        return
    }

    descripcion.value = gastoEncontrado.descripcion
    categoria.value = gastoEncontrado.categoria
    monto.value = gastoEncontrado.monto
    fecha.value = gastoEncontrado.fecha
    metodoPago.value = gastoEncontrado.metodoPago
    nota.value = gastoEncontrado.nota

    idGastoEditar = gastoEncontrado.id

    botonRegistrar.textContent = 'Actualizar gasto'

    mensajeFormulario.textContent = 'Editando gasto seleccionado'

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

function eliminarGasto(id) {
    const confirmar = confirm ('¿Seguro que deseas eliminar este gasto?')

    if (!confirmar) {
        return
    }

    gastos = gastos.filter(function (gasto) {
        return gasto.id !== id
    })

    if (idGastoEditar === id) {
        idGastoEditar = null
        formularioGasto.reset()
        botonRegistrar.textContent = 'Registrar gasto'
    }

    localStorage.setItem ('gastos', JSON.stringify(gastos))

    mostrarGastos()

    mensajeFormulario.textContent = 'Gasto eliminado correctamente.'
}