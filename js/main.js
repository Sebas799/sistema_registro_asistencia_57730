// Autor: Salas, Sebastián Ariel.
// Comisión: 57730.

// ----------------------- FUNCIONES ---------------------------------
// ---- CONSTRUCTOR DE NUEVOS EMPLEADOS -----
function Empleado(nombre, apellido, dni) {
  this.nombre = nombre;
  this.apellido = apellido;
  this.dni = dni;
  this.horasTrabajadas = 0;
  this.sueldoTotal = 0;
}

// --- ARRAY DE EMPLEADOS ----
let empleados = JSON.parse(localStorage.getItem("empleados")) || [];

document.addEventListener("DOMContentLoaded", () => {
  if (empleados.length === 0) {
    // Si el localStorage está vacío, cargar desde el JSON
    fetch("empleados.json")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Inicializa "horasTrabajadas" y "sueldoTotal" en 0 si están undefined
          empleados = data.map((emp) => ({
            ...emp,
            horasTrabajadas: emp.horasTrabajadas || 0,
            sueldoTotal: emp.sueldoTotal || 0,
          }));
          // Guardar los empleados cargados en el localStorage
          localStorage.setItem("empleados", JSON.stringify(empleados));
          actualizarTabla();
        } else {
          console.error("El JSON cargado no es un array.");
        }
      })
      .catch((error) => console.error("Error al cargar el archivo JSON:", error));
  } else {
    // Si ya hay datos en localStorage, actualizar la tabla directamente
    actualizarTabla();
  }
});

//-------------------- DOM -------------------------
document.getElementById("openFormAgregarEmpleado").addEventListener("click", function () {
    createFloatingForm("agregar");
  });

document.getElementById("openFormRegistrarHoras").addEventListener("click", function () {
    createFloatingForm("registrarHoras");
  });

document.getElementById("openFormAgregarBonificacion").addEventListener("click", function () {
    createFloatingForm("agregarBonificacion");
  });

function createFloatingForm(type) {
  // CONTENEDOR FORMULARIO
  const formContainer = document.createElement("div");
  formContainer.id = "floatingForm";
  formContainer.className = "floating-form";

  // FORMULARIO DINÁMICO
  const form = document.createElement("form");
  form.id = "dataForm";

  if (type === "agregar") {
    createAgregarEmpleadoForm(form);
  } else if (type === "registrarHoras") {
    createRegistrarHorasForm(form);
  } else if (type === "agregarBonificacion") {
    createAgregarBonificacionForm(form);
  }

  // BOTON DE CERRAR
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.id = "closeFormButton";
  closeButton.textContent = "Cerrar";
  form.appendChild(closeButton);

  // Agregar el formulario al contenedor
  formContainer.appendChild(form);

  // Agregar el contenedor al cuerpo del documento
  document.body.appendChild(formContainer);

  // Mostrar el formulario
  formContainer.style.display = "block";

  // Añadir el evento de cerrar
  closeButton.addEventListener("click", function () {
    formContainer.style.display = "none";
    document.body.removeChild(formContainer);
  });
}

function createAgregarEmpleadoForm(form) {
  // CAMPOS DEL FORMULARIO
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.id = "name";
  nameInput.name = "name";
  nameInput.placeholder = "Nombre";
  nameInput.required = true;
  form.appendChild(nameInput);

  const lastNameInput = document.createElement("input");
  lastNameInput.type = "text";
  lastNameInput.id = "lastName";
  lastNameInput.name = "lastName";
  lastNameInput.placeholder = "Apellido";
  lastNameInput.required = true;
  form.appendChild(lastNameInput);

  const dniInput = document.createElement("input");
  dniInput.type = "text";
  dniInput.id = "dni";
  dniInput.name = "dni";
  dniInput.placeholder = "D.N.I";
  dniInput.required = true;
  form.appendChild(dniInput);

  // BOTON DE ENVIAR
  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Enviar";
  form.appendChild(submitButton);

  // Añadir el evento de enviar
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const empleado = crearEmpleado(
      nameInput.value,
      lastNameInput.value,
      dniInput.value
    );
    empleados.push(empleado);
    localStorage.setItem("empleados", JSON.stringify(empleados));
    //ALERTA DE OK
    Swal.fire({
      position: "center",
      icon: "success",
      title: "El empleado ha sido registrado con éxito.",
      showConfirmButton: false,
      timer: 1500
    });
    agregarEmpleadoTabla(empleado);
    document.getElementById("floatingForm").remove();
  });
}

function createRegistrarHorasForm(form) {
  const dniInput = document.createElement("input");
  dniInput.type = "text";
  dniInput.id = "dni";
  dniInput.name = "dni";
  dniInput.placeholder = "D.N.I";
  dniInput.required = true;
  form.appendChild(dniInput);

  const horaInicioInput = document.createElement("input");
  horaInicioInput.type = "time";
  horaInicioInput.id = "horaInicio";
  horaInicioInput.name = "horaInicio";
  horaInicioInput.required = true;
  form.appendChild(horaInicioInput);

  const horaFinInput = document.createElement("input");
  horaFinInput.type = "time";
  horaFinInput.id = "horaFin";
  horaFinInput.name = "horaFin";
  horaFinInput.required = true;
  form.appendChild(horaFinInput);

  const valorHoraInput = document.createElement("input");
  valorHoraInput.type = "number";
  valorHoraInput.id = "valorHora";
  valorHoraInput.name = "valorHora";
  valorHoraInput.placeholder = "Valor Hora";
  valorHoraInput.required = true;
  form.appendChild(valorHoraInput);

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Registrar";
  form.appendChild(submitButton);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const dni = dniInput.value;
    const horaInicio = horaInicioInput.value.split(":");
    const horaFin = horaFinInput.value.split(":");
    const valorHora = parseFloat(valorHoraInput.value);
    const inicioMinutos =
      parseInt(horaInicio[0]) * 60 + parseInt(horaInicio[1]);
    const finMinutos = parseInt(horaFin[0]) * 60 + parseInt(horaFin[1]);
    const totalMinutosTrabajados = finMinutos - inicioMinutos;
    const horasTrabajadas = totalMinutosTrabajados / 60;
    const empleado = empleados.find((emp) => emp.dni === dni);

    if (empleado) {
      const sueldoBase = horasTrabajadas * valorHora;
      const sueldoTotal =
        horasTrabajadas > 8
          ? sueldoBase + (horasTrabajadas - 8) * valorHora * 0.5
          : sueldoBase;

      empleado.horasTrabajadas += horasTrabajadas;
      empleado.sueldoTotal += sueldoTotal;

      localStorage.setItem("empleados", JSON.stringify(empleados));
      //ALERTA OK
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Horas registradas con éxito.",
        showConfirmButton: false,
        timer: 1500
      });
      actualizarTabla();
    } else {
      //ALERTA DE ERROR
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Empleado no encontrado.",
        showConfirmButton: false,
        timer: 1500
      });
    }

    document.getElementById("floatingForm").remove();
  });
}

function createAgregarBonificacionForm(form) {
  const dniInput = document.createElement("input");
  dniInput.type = "text";
  dniInput.id = "dni";
  dniInput.name = "dni";
  dniInput.placeholder = "D.N.I";
  dniInput.required = true;
  form.appendChild(dniInput);

  const bonificacionInput = document.createElement("input");
  bonificacionInput.type = "number";
  bonificacionInput.id = "bonificacion";
  bonificacionInput.name = "bonificacion";
  bonificacionInput.placeholder = "Bonificación";
  bonificacionInput.required = true;
  form.appendChild(bonificacionInput);

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Agregar";
  form.appendChild(submitButton);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const dni = dniInput.value;
    const bonificacion = parseFloat(bonificacionInput.value);
    const empleado = empleados.find((emp) => emp.dni === dni);

    if (empleado) {
      empleado.sueldoTotal += bonificacion;
      localStorage.setItem("empleados", JSON.stringify(empleados));
      //ALERTA OK.
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Bonificacion cargada correctamente",
        showConfirmButton: false,
        timer: 1500
      });
      actualizarTabla();
    } else {
      //ALERTA DE ERROR
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Empleado no encontrado.",
        showConfirmButton: false,
        timer: 1500
      });
    }

    document.getElementById("floatingForm").remove();
  });
}

function crearEmpleado(nombre, apellido, dni) {
  return new Empleado(nombre, apellido, dni);
}

function agregarEmpleadoTabla(empleado) {
  const tbody = document.querySelector("#empleadosTable tbody");
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${empleado.dni}</td>
    <td>${empleado.nombre}</td>
    <td>${empleado.apellido}</td>
    <td>${empleado.horasTrabajadas}</td>
    <td>$ ${empleado.sueldoTotal}</td>
    <td><button class="btn btn-danger" onclick="eliminarEmpleado('${empleado.dni}')">Eliminar</button></td>
`;
  tbody.appendChild(row);
}

function actualizarTabla() {
  const tbody = document.querySelector("#empleadosTable tbody");
  tbody.innerHTML = "";
  empleados.forEach((empleado) => agregarEmpleadoTabla(empleado));
}

function eliminarEmpleado(dni) {
  // Primero, preguntar al usuario si realmente quiere eliminar el registro
  Swal.fire({
    title: '¿Estás seguro?',
    text: "¡No podrás revertir esta acción!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminarlo',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Si el usuario confirma, se elimina el empleado
      const index = empleados.findIndex((emp) => emp.dni === dni);
      if (index > -1) {
        empleados.splice(index, 1);
        localStorage.setItem("empleados", JSON.stringify(empleados));
        actualizarTabla();

        Swal.fire(
          'Eliminado',
          'El empleado ha sido eliminado.',
          'success'
        );
      }
    } else {
      // Si el usuario cancela, se muestra una notificación de cancelación
      Swal.fire(
        'Cancelado',
        'El empleado no ha sido eliminado.',
        'error'
      );
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  actualizarTabla();
});
