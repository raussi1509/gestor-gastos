# Gestor de Gastos Personales

Aplicación web para registrar y administrar gastos personales.

## Objetivo

Permitir al usuario registrar, consultar, editar, eliminar y filtrar sus gastos, mostrando además un resumen general de la información financiera.

## Tecnologías utilizadas

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Node.js
- Express
- API REST

### Base de datos

- SQL Server

### Herramientas

- Git
- GitHub
- Git Flow
- Visual Studio Code
- SQL Server Management Studio

## Funcionalidades

- Registrar gastos.
- Consultar gastos.
- Editar gastos.
- Eliminar gastos.
- Buscar por descripción.
- Filtrar por categoría.
- Calcular total gastado.
- Mostrar cantidad de gastos.
- Calcular promedio por gasto.
- Mostrar el gasto más alto.

## Estructura del proyecto

```text
GestorGastos/
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── js/
│       └── app.js
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── routes/
│   │   │   └── gastos.routes.js
│   │   └── app.js
│   ├── package.json
│   └── package-lock.json
└── README.md