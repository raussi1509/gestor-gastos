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
const buscarGasto = document.getElementById('buscarGasto')
const filtroCategoria = document.getElementById('filtroCategoria')
const totalGastado = document.getElementById('totalGastado')
const cantidadGastos = document.getElementById('cantidadGastos')
const promedioGastos = document.getElementById('promedioGastos')
const gastoMasAlto = document.getElementById('gastoMasAlto')
const API_URL = 'http://localhost:3000/api/gastos'

let gastos = []

let idGastoEditar = null

async function cargarGastos() {
    try {
        const respuesta = await fetch(API_URL)

        if (!respuesta.ok) {
            throw new Error('No fue posible obtener los gastos.')
        }

        const datos = await respuesta.json()

        gastos = datos.map(function (gasto) {
            return {
                id: Number(gasto.Id),
                descripcion: gasto.Descripcion,
                categoria: gasto.Categoria,
                monto: Number(gasto.Monto),
                fecha: gasto.Fecha.split('T')[0],
                metodoPago: gasto.MetodoPago,
                nota: gasto.Nota || ''
            }
        })

        filtrarGasto()
        actualizarResumen()
    } catch (error) {
        console.error(error)

        listaGastos.innerHTML =
            '<p>No fue posible cargar los gastos.</p>'
    }
}

function mostrarGastos(lista = gastos) {
    listaGastos.innerHTML = ''

    if (lista.length === 0) {
        listaGastos.innerHTML = '<p>No se encontraron gastos.</p>'
        return
    }

    for (const gasto of lista) {
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

formularioGasto.addEventListener('submit', async function (e) {
    e.preventDefault()

    const gastoFormulario = {
        descripcion: descripcion.value.trim(),
        categoria: categoria.value,
        monto: Number(monto.value),
        fecha: fecha.value,
        metodoPago: metodoPago.value,
        nota: nota.value.trim()
    }

    try {
        let respuesta

        if (idGastoEditar === null) {
            respuesta = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gastoFormulario)
            })
        } else {
            respuesta = await fetch(`${API_URL}/${idGastoEditar}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gastoFormulario)
            })
        }

        if (!respuesta.ok) {
            throw new Error('No fue posible guardar el gasto.')
        }

        if (idGastoEditar === null) {
            mensajeFormulario.textContent =
                'Gasto registrado correctamente.'
        } else {
            mensajeFormulario.textContent =
                'Gasto actualizado correctamente.'
        }

        idGastoEditar = null
        botonRegistrar.textContent = 'Registrar gasto'
        formularioGasto.reset()

        await cargarGastos()
    } catch (error) {
        console.error(error)

        mensajeFormulario.textContent =
            'Ocurrió un error al guardar el gasto.'
    }
})

cargarGastos()

function actualizarResumen() {
    const total = gastos.reduce(function (acumulador, gasto) {
        return acumulador + gasto.monto
    }, 0)

    const cantidad = gastos.length

    const promedio = cantidad > 0
        ? total / cantidad
        : 0

    const mayor = cantidad > 0
        ? Math.max(...gastos.map(function (gasto) {
            return gasto.monto
        }))
        : 0

    totalGastado.textContent = `RD$${total.toFixed(2)}`
    cantidadGastos.textContent = cantidad
    promedioGastos.textContent = `RD$${promedio.toFixed(2)}`
    gastoMasAlto.textContent = `RD$${mayor.toFixed(2)}`
}

function filtrarGasto() {
    const textoBusqueda = buscarGasto.value.trim().toLowerCase()
    const categoriaSeleccionada = filtroCategoria.value

    const gastosFiltrados = gastos.filter(function (gasto) {
        const coincideDescripcion = gasto.descripcion
            .toLowerCase()
            .includes(textoBusqueda)

        const coincideCategoria =
            categoriaSeleccionada === '' ||
            gasto.categoria === categoriaSeleccionada

        return coincideDescripcion && coincideCategoria
    })

    mostrarGastos(gastosFiltrados)
}

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

async function eliminarGasto(id) {
    const confirmar = confirm(
        '¿Seguro que deseas eliminar este gasto?'
    )

    if (!confirmar) {
        return
    }

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })

        if (!respuesta.ok) {
            throw new Error('No fue posible eliminar el gasto.')
        }

        if (idGastoEditar === id) {
            idGastoEditar = null
            formularioGasto.reset()
            botonRegistrar.textContent = 'Registrar gasto'
        }

        mensajeFormulario.textContent =
            'Gasto eliminado correctamente.'

        await cargarGastos()
    } catch (error) {
        console.error(error)

        mensajeFormulario.textContent =
            'Ocurrió un error al eliminar el gasto.'
    }
}

buscarGasto.addEventListener('input', filtrarGasto)

filtroCategoria.addEventListener('change', filtrarGasto)