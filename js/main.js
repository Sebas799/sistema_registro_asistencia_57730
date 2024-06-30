// --- FUNCIONES ---
function mostrarMenu (){
    alert (' ---- MENU DE OPCIONES ----' + 
        '\n 1. Ingresar NUEVO empleado.' +
        '\n 2. Cargar ASISTENCIA.' +
        '\n 3. Calcular el SUELDO.' +
        '\n 4. Agregar BONIFICACION. ' +
        '\n 0. Salir.' 
    );
}

function esHoraExtra(horasTrabajadas){
    return horasTrabajadas > 8 ? ((horasTrabajadas - 8) * 1.5 + 8) : horasTrabajadas;
}

function calculoHora(horasTrabajadas, valorHora){
    return horasTrabajadas * valorHora;
}

// ESTA FUNCION CONTROLA QUE LA HORA FINAL NO SEA ANTERIOR A LA DE INICIO <FORMATO 0 - 24HS>.
function calcularHorasTrabajadas(horaInicio, horaFin) {
    if (horaInicio >= 0 && horaInicio <= 24 && horaFin >= 0 && horaFin <= 24 && horaFin >= horaInicio) {
        return horaFin - horaInicio;
    } else {
        alert('Horas ingresadas <NO VALIDAS>. Intente nuevamente.');
        return -1; // VALOR QUE INDICA ERROR
    }
}

alert("BIENVENIDO AL SISTEMA DE ASISTENCIA");

// --- VARIABLES ---
let opcion = -1;
let empleado = '';
let horasTrabajadas = 0;
let valorHora = 0;
let sueldoTotal = 0;

// --- MAIN ---
// MOSTRAR MENU DE OPCIONES

while (opcion !== 0) {
    mostrarMenu();
    opcion = Number(prompt('Ingrese una opcion del 0 al 4: '));
    switch(opcion){
        // INGRESAR EL NOMBRE DEL EMPLEADO.
        case 1 :
            empleado = prompt('Ingrese el NOMBRE del empleado: ');
            break;

        // CARGAR ASISTENCIA.
        case 2 :
            let horasInicio = Number(prompt('Ingrese la HORA DE INGRESO (FROMATO 0 - 24hs): '));
            let horasFin = Number(prompt('Ingrese la HORA DE EGRESO (FROMATO 0 - 24hs): '));
            horasTrabajadas = calcularHorasTrabajadas(horasInicio, horasFin);
            if (horasTrabajadas === -1) {
                // SI NO ES VALIDO, NO CONTINUA. 
                break;
            }
            break;

        // SACAR CALCULO DEL SUELDO.
        case 3 :
            valorHora = Number(prompt('Ingrese el VALOR de la hora: '));
            let horasConExtra = esHoraExtra(horasTrabajadas);
            sueldoTotal = calculoHora(horasConExtra, valorHora);
            alert('EMPLEADO: '+ empleado + ' TOTAL: $' + sueldoTotal);
            break;
        
        // AGREGAR BONIFICACION EXTRA AL SUELDO.
        case 4 :
            let bonificacion = Number(prompt('Ingrese el monto de la BONIFICACION: $ '));
            let sueldoConBoni = sueldoTotal + bonificacion;
            alert('EMPLEADO: '+ empleado + ' TOTAL: $' + sueldoConBoni);
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