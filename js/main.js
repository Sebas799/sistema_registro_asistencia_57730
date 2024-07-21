// Autor: Salas, Sebastián Ariel. 
// Comisión: 57730.

// ----------------------- FUNCIONES ---------------------------------
function mostrarMenu (){
    alert (' ---- MENU DE OPCIONES ----' + 
        '\n 1. Ingresar NUEVO empleado.' +
        '\n 2. Cargar ASISTENCIA.' +
        '\n 3. Calcular el SUELDO.' +
        '\n 4. Agregar BONIFICACION. ' +
        '\n 0. Salir.' 
    );
}
// ---- CONSTRUCTOR DE NUEVOS EMPLEADOS -----
function Empleado (nombre, apellido, dni){
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
    this.horasTrabajadas = 0;
    this.sueldoTotal = 0;

}

// --- PEDIR QUE EL EMPLEADO CARGUE SUS DATOS ----
function obtenerDatosDeEmpleado(){
    const nombre = prompt("Ingrese su NOMBRE: ");
    const apellido = prompt("Ingrese su APELLIDO: ");
    const dni = Number(prompt("Ingrese su DNI: "));
    return new Empleado(nombre, apellido, dni);
}

function esHoraExtra(horasTrabajadas){
    return horasTrabajadas > 8 ? ((horasTrabajadas - 8) * 1.5 + 8) : horasTrabajadas;
}

function calculoHora(horasTrabajadas, valorHora){
    return horasTrabajadas * valorHora;
}

// ESTA FUNCION CONTROLA QUE LA HORA FINAL NO SEA ANTERIOR A LA DE INICIO <FORMATO 0 - 24HS>.
function calcularHorasTrabajadas(horaInicio, horaFin) {
    if (horaInicio>=0 && horaFin<=24 && horaFin>horaInicio) {
        return horaFin - horaInicio;
    } else {
        alert('Horas ingresadas <NO VALIDAS>. Intente nuevamente.');
        return -1; // VALOR QUE INDICA ERROR    
    }
}

// FUNCION PARA SELECCIONAR EL EMPLEADO Y RETORNAR EL INDICE
function seleccionarEmpleado (){
    let empleadoSeleccionado = prompt("¿A que empleado desea seleccionar?")
    return empleados.findIndex(empleado => empleado.nombre.toLowerCase() === empleadoSeleccionado.toLowerCase());
}

// FUNCION QUE CARGA LAS HORAS TRABAJADAS DE LOS EMPLEADOS
function cargarHoras(indiceEmpleado) {
    const horasInicio = Number(prompt("Ingrese la HORA DE INICIO"));
    const horasFin = Number(prompt("Ingrese la HORA DE SALIDA"));
    const horasTrabajadas = calcularHorasTrabajadas(horasInicio, horasFin);
    if (horasTrabajadas !== -1) {
        empleados[indiceEmpleado].horasTrabajadas += horasTrabajadas;
    }
    return horasTrabajadas;
}

alert("BIENVENIDO AL SISTEMA DE ASISTENCIA");

// --- VARIABLES ---
let opcion = -1;

// --- ARRAY DE EMPLEADOS ----
const empleados = [];

// ------------------------------------------------ MAIN ------------------------------------------------------

while (opcion !== 0) {
    mostrarMenu(); // MOSTRAR MENU DE OPCIONES
    opcion = Number(prompt('Ingrese una opcion del 0 al 4: '));
    switch(opcion){
        // ----- CARGAR EMPLEADOS ---
        case 1 :
            // ---- CARGA DE EMPLEADOS ----
            let continuar = true;
            while (continuar) {
                const empleado = obtenerDatosDeEmpleado();
                empleados.push(empleado);
                continuar = confirm("¿Desea cargar otro empleado? ")
                console.log(empleados);
            }
            break;

        // CARGAR ASISTENCIA.
        case 2 :
            // --- INSERTAR ASISTENCIA ----
            let continua = true;
            while (continua) {
                let indiceEmpleado = seleccionarEmpleado();
                if (indiceEmpleado !== -1 ){
                    cargarHoras(indiceEmpleado);
                    continua = confirm("¿Desea continuar cargando?")
                }else{
                    alert("El Empleado que intenta buscar, NO EXISTE. Por favor intente de nuevo.");
                }
            }
            break;

        // SACAR CALCULO DEL SUELDO.
        case 3 :
            indiceEmpleadoSueldo = seleccionarEmpleado();
            if (indiceEmpleadoSueldo !== -1){
                valorHora = Number(prompt('Ingrese el VALOR de la hora: '));
                let horasConExtra = esHoraExtra(empleados[indiceEmpleadoSueldo].horasTrabajadas);
                empleados[indiceEmpleadoSueldo].sueldoTotal = calculoHora(horasConExtra, valorHora);
                alert('EMPLEADO: '+ empleados[indiceEmpleadoSueldo].nombre.toUpperCase()+ ' TOTAL: $' + empleados[indiceEmpleadoSueldo].sueldoTotal);
            }else{
                alert("El Empleado que intenta buscar, NO EXISTE. Por favor intente de nuevo.");
            }
            break;
        
        // AGREGAR BONIFICACION EXTRA AL SUELDO.
        case 4 :
            indiceEmpleadoBonificacion = seleccionarEmpleado();
            if (indiceEmpleadoBonificacion !== -1){
                let bonificacion = Number(prompt('Ingrese el monto de la BONIFICACION: $ '));
                empleados[indiceEmpleadoBonificacion].sueldoTotal = empleados[indiceEmpleadoBonificacion].sueldoTotal + bonificacion;
                alert('EMPLEADO: '+ empleados[indiceEmpleadoBonificacion].nombre.toUpperCase() + ' TOTAL: $' + empleados[indiceEmpleadoBonificacion].sueldoTotal);
            }
            else{
                    alert("El Empleado que intenta buscar, NO EXISTE. Por favor intente de nuevo.");
            }
            break;

        //  SALIR DEL MENU
        case 0 :   
            alert('Gracias por usar el sistema.');
            break;

        // EN CUALQUIER OTRA OPCION, MOSTRAR ESTE MENSAJE.
        default:
            alert("Opcion NO VALIDA, vuelva a intentar, por favor. ");
    }
}