// Lista de platillos disponibles en el restaurante
const menu = [
  { nombre: 'Bruschetta Clásica', descripcion: 'Pan tostado con tomate y albahaca fresca', precio: 4500, categoria: 'Entrada' },
  { nombre: 'Tabla de Quesos', descripcion: 'Selección de quesos importados con mermelada', precio: 7800, categoria: 'Entrada' },
  { nombre: 'Lomo al Vino Tinto', descripcion: 'Lomo de res en reducción de vino tinto', precio: 15500, categoria: 'Plato Fuerte' },
  { nombre: 'Pasta Carbonara', descripcion: 'Pasta con tocino, huevo y queso parmesano', precio: 10200, categoria: 'Plato Fuerte' },
  { nombre: 'Salmón a la Plancha', descripcion: 'Filete de salmón con vegetales al vapor', precio: 13800, categoria: 'Plato Fuerte' },
  { nombre: 'Tiramisú', descripcion: 'Postre italiano con café y mascarpone', precio: 5200, categoria: 'Postre' },
  { nombre: 'Cheesecake de Maracuyá', descripcion: 'Cheesecake cremoso con coulis de maracuyá', precio: 4800, categoria: 'Postre' },
];

// Arreglo donde se almacenan las reservas registradas
const reservas = [];

// Guarda la categoría de menú actualmente seleccionada
let categoriaActiva = "Todos";

// Dibuja las cards de platillos en el contenedor del menú
function renderMenu(lista = menu) {
  const contenedor = document.getElementById("contenedor-menu");
  contenedor.innerHTML = "";

  lista.forEach((plato) => {
    const card = document.createElement("article");
    card.classList.add("card-plato");

    const titulo = document.createElement("h3");
    titulo.textContent = plato.nombre;

    const desc = document.createElement("p");
    desc.textContent = plato.descripcion;

    const cat = document.createElement("p");
    cat.textContent = plato.categoria;
    cat.classList.add("card-plato-categoria");

    const precio = document.createElement("p");
    precio.textContent = "₡" + plato.precio.toLocaleString("es-CR");
    precio.classList.add("card-plato-precio");

    card.appendChild(titulo);
    card.appendChild(desc);
    card.appendChild(cat);
    card.appendChild(precio);

    contenedor.appendChild(card);
  });
}

// Cambia la categoría activa y vuelve a mostrar el menú filtrado
function filtrarCategoria(categoria) {
  categoriaActiva = categoria;

  // Actualiza el estilo visual de los botones de filtro
  const botones = document.querySelectorAll(".btn-filtro");
  botones.forEach((btn) => {
    if (btn.getAttribute("data-cat") === categoria) {
      btn.classList.add("activo");
    } else {
      btn.classList.remove("activo");
    }
  });

  // Muestra todos los platillos o solo los de la categoría seleccionada
  if (categoria === "Todos") {
    renderMenu(menu);
  } else {
    const filtrados = menu.filter((plato) => plato.categoria === categoria);
    renderMenu(filtrados);
  }
}

// Revisa los campos del formulario y decide si el formulario es válido
function validarFormulario() {
  const inputNombre   = document.getElementById("res-nombre");
  const inputCorreo   = document.getElementById("res-correo");
  const inputFecha    = document.getElementById("res-fecha");
  const inputHora     = document.getElementById("res-hora");
  const inputPersonas = document.getElementById("res-personas");
  const btnReserva    = document.getElementById("btn-reserva");

  const errorNombre   = document.getElementById("error-res-nombre");
  const errorCorreo   = document.getElementById("error-res-correo");
  const errorFecha    = document.getElementById("error-res-fecha");
  const errorHora     = document.getElementById("error-res-hora");
  const errorPersonas = document.getElementById("error-res-personas");

  let esValido = true;

  // Validación: nombre (mínimo 5 caracteres, solo letras y espacios)
  const nombre = inputNombre.value.trim();
  const soloLetrasEspacios = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
  if (nombre === "") {
    errorNombre.textContent = "";
    esValido = false;
  } else if (nombre.length < 5) {
    errorNombre.textContent = "El nombre debe tener al menos 5 caracteres.";
    esValido = false;
  } else if (!soloLetrasEspacios.test(nombre)) {
    errorNombre.textContent = "El nombre solo puede contener letras y espacios.";
    esValido = false;
  } else {
    errorNombre.textContent = "";
  }

  // Validación: correo (no vacío y con formato básico de email)
  const correo = inputCorreo.value.trim();
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (correo === "") {
    errorCorreo.textContent = "";
    esValido = false;
  } else if (!regexCorreo.test(correo)) {
    errorCorreo.textContent = "El formato del correo no es válido.";
    esValido = false;
  } else {
    errorCorreo.textContent = "";
  }

  // Validación: fecha (no vacía y no anterior al día actual)
  const fechaValor = inputFecha.value;
  if (fechaValor === "") {
    errorFecha.textContent = "";
    esValido = false;
  } else {
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    const fechaSeleccionada = new Date(fechaValor + "T00:00:00");
    if (fechaSeleccionada < hoy) {
      errorFecha.textContent = "La fecha no puede ser pasada.";
      esValido = false;
    } else {
      errorFecha.textContent = "";
    }
  }

  // Validación: hora (debe tener algún valor seleccionado)
  const hora = inputHora.value;
  if (hora === "") {
    errorHora.textContent = "";
    esValido = false;
  } else {
    errorHora.textContent = "";
  }

  // Validación: número de personas (entre 1 y 20)
  const personas = parseInt(inputPersonas.value, 10);
  if (inputPersonas.value === "") {
    errorPersonas.textContent = "";
    esValido = false;
  } else if (isNaN(personas)) {
    errorPersonas.textContent = "El número de personas es obligatorio.";
    esValido = false;
  } else if (personas < 1 || personas > 20) {
    errorPersonas.textContent = "El número de personas debe estar entre 1 y 20.";
    esValido = false;
  } else {
    errorPersonas.textContent = "";
  }

  // El botón de envío se activa solo cuando todo es válido
  btnReserva.disabled = !esValido;
  return esValido;
}

// Toma los datos del formulario, crea una reserva y la muestra en la tabla
function agregarReserva() {
  const nombre   = document.getElementById("res-nombre").value.trim();
  const correo   = document.getElementById("res-correo").value.trim();
  const fecha    = document.getElementById("res-fecha").value;
  const hora     = document.getElementById("res-hora").value;
  const personas = parseInt(document.getElementById("res-personas").value, 10);
  const comentarios = document.getElementById("res-comentarios").value.trim();

  const reserva = { nombre, correo, fecha, hora, personas, comentarios };
  reservas.push(reserva);

  // Crea una nueva fila en la tabla de reservas
  const tbody = document.getElementById("tbody-reservas");
  const fila = document.createElement("tr");
  fila.classList.add("fila-reserva");

  // Las reservas de 6 o más personas se marcan visualmente
  if (personas >= 6) {
    fila.classList.add("grupo-grande");
  }

  const tdNombre   = document.createElement("td");
  const tdCorreo   = document.createElement("td");
  const tdFecha    = document.createElement("td");
  const tdHora     = document.createElement("td");
  const tdPersonas = document.createElement("td");

  tdNombre.textContent   = nombre;
  tdCorreo.textContent   = correo;
  tdFecha.textContent    = fecha;
  tdHora.textContent     = hora;
  tdPersonas.textContent = personas;

  fila.appendChild(tdNombre);
  fila.appendChild(tdCorreo);
  fila.appendChild(tdFecha);
  fila.appendChild(tdHora);
  fila.appendChild(tdPersonas);

  tbody.appendChild(fila);

  // Limpia el formulario y vuelve a desactivar el botón de envío
  document.getElementById("form-reserva").reset();
  document.getElementById("btn-reserva").disabled = true;

  // Limpia los mensajes de error
  document.getElementById("error-res-nombre").textContent   = "";
  document.getElementById("error-res-correo").textContent   = "";
  document.getElementById("error-res-fecha").textContent    = "";
  document.getElementById("error-res-hora").textContent     = "";
  document.getElementById("error-res-personas").textContent = "";

  // Vuelve a evaluar el formulario y actualiza el resumen de reservas
  validarFormulario();
  actualizarResumen();
}

// Calcula totales y muestra un resumen de las reservas registradas
function actualizarResumen() {
  const contenedor = document.getElementById("resumen-reservas");

  // Si no hay reservas, se muestra un mensaje simple
  if (reservas.length === 0) {
    contenedor.textContent = "No hay reservas registradas.";
    return;
  }

  let totalPersonas = 0;
  let mayor = reservas[0];

  reservas.forEach((res) => {
    totalPersonas += res.personas;
    if (res.personas > mayor.personas) {
      mayor = res;
    }
  });

  contenedor.innerHTML = `
    <p>Total de reservas: <strong>${reservas.length}</strong></p>
    <p>Total de personas esperadas: <strong>${totalPersonas}</strong></p>
    <p>Reserva con más personas: <strong>${mayor.nombre}</strong> (${mayor.personas} personas)</p>
  `;
}

// Configura los eventos cuando la página termina de cargar
document.addEventListener("DOMContentLoaded", function () {
  // Muestra todos los platillos al inicio
  renderMenu();

  // Asigna el filtro correspondiente a cada botón de categoría
  const botones = document.querySelectorAll(".btn-filtro");
  botones.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.getAttribute("data-cat");
      filtrarCategoria(cat);
    });
  });

  // Conecta el formulario con la validación en tiempo real y el envío
  const formReserva = document.getElementById("form-reserva");
  const camposAValidar = [
    "res-nombre",
    "res-correo",
    "res-fecha",
    "res-hora",
    "res-personas"
  ];

  // Valida cuando se escribe o se cambia un valor en estos campos
  camposAValidar.forEach((id) => {
    const campo = document.getElementById(id);
    campo.addEventListener("input", validarFormulario);
    campo.addEventListener("change", validarFormulario);
  });

  // Maneja el envío del formulario de reservas
  formReserva.addEventListener("submit", function (e) {
    e.preventDefault();
    const ok = validarFormulario();
    if (ok) {
      agregarReserva();
    }
  });

  // Estado inicial del formulario y del resumen
  validarFormulario();
  actualizarResumen();
});