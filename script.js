// Juego del Ahorcado - Términos de Bases de Datos
const palabras = [
    "DATABASE", "SQL", "MYSQL", "POSTGRESQL", "MONGODB", 
    "ORACLE", "TABLA", "CONSULTA", "INDICE", "TRANSACCION"
];

let palabraSecreta = "";
let palabraAdivinada = [];
let intentosRestantes = 7;
let letrasUsadas = [];
let juegoTerminado = false;

// Elementos del DOM
const wordDisplay = document.getElementById('wordDisplay');
const attemptsElement = document.getElementById('attempts');
const usedLettersElement = document.getElementById('usedLetters');
const hangmanFigure = document.getElementById('hangmanFigure');
const messageElement = document.getElementById('message');
const keyboardElement = document.getElementById('keyboard');
const hintBtn = document.getElementById('hintBtn');
const resetBtn = document.getElementById('resetBtn');

// Figuras del ahorcado por intento
const figurasAhorcado = [
    "🧠", // 7 intentos
    "😊", // 6 intentos
    "😐", // 5 intentos
    "😟", // 4 intentos
    "😨", // 3 intentos
    "😰", // 2 intentos
    "😵", // 1 intento
    "💀"  // 0 intentos - perdiste
];

// Inicializar el juego
function iniciarJuego() {
    // Seleccionar palabra aleatoria
    palabraSecreta = palabras[Math.floor(Math.random() * palabras.length)];
    
    // Inicializar array de letras adivinadas
    palabraAdivinada = Array(palabraSecreta.length).fill('_');
    
    // Reiniciar variables
    intentosRestantes = 7;
    letrasUsadas = [];
    juegoTerminado = false;
    
    // Actualizar interfaz
    actualizarInterfaz();
    
    // Crear teclado
    crearTeclado();
    
    // Limpiar mensajes
    messageElement.textContent = "";
    messageElement.style.color = "";
}

// Crear teclado virtual
function crearTeclado() {
    keyboardElement.innerHTML = '';
    
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let letra of letras) {
        const boton = document.createElement('div');
        boton.className = 'key';
        boton.textContent = letra;
        boton.addEventListener('click', () => adivinarLetra(letra));
        
        // Deshabilitar si ya se usó
        if (letrasUsadas.includes(letra)) {
            boton.classList.add('used');
        }
        
        keyboardElement.appendChild(boton);
    }
}

// Adivinar una letra
function adivinarLetra(letra) {
    if (juegoTerminado || letrasUsadas.includes(letra)) return;
    
    letrasUsadas.push(letra);
    
    // Verificar si la letra está en la palabra
    let acierto = false;
    for (let i = 0; i < palabraSecreta.length; i++) {
        if (palabraSecreta[i] === letra) {
            palabraAdivinada[i] = letra;
            acierto = true;
        }
    }
    
    // Si no acertó, reducir intentos
    if (!acierto) {
        intentosRestantes--;
    }
    
    // Actualizar interfaz
    actualizarInterfaz();
    
    // Verificar estado del juego
    verificarEstadoJuego();
}

// Actualizar interfaz
function actualizarInterfaz() {
    // Mostrar palabra con espacios entre letras
    wordDisplay.textContent = palabraAdivinada.join(' ');
    
    // Actualizar intentos
    attemptsElement.textContent = intentosRestantes;
    
    // Actualizar letras usadas
    usedLettersElement.textContent = letrasUsadas.join(', ');
    
    // Actualizar figura del ahorcado
    const figuraIndex = 7 - intentosRestantes;
    hangmanFigure.textContent = figurasAhorcado[figuraIndex];
    
    // Recrear teclado para actualizar estado de teclas
    crearTeclado();
}

// Verificar estado del juego
function verificarEstadoJuego() {
    // Verificar si ganó
    if (!palabraAdivinada.includes('_')) {
        juegoTerminado = true;
        messageElement.textContent = "¡Felicidades! Has adivinado la palabra: " + palabraSecreta;
        messageElement.style.color = "green";
    }
    // Verificar si perdió
    else if (intentosRestantes <= 0) {
        juegoTerminado = true;
        messageElement.textContent = "¡Game Over! La palabra era: " + palabraSecreta;
        messageElement.style.color = "red";
    }
}

// Dar pista
function darPista() {
    if (juegoTerminado) return;
    
    // Encontrar una letra no adivinada
    let letrasPorAdivinar = [];
    for (let i = 0; i < palabraSecreta.length; i++) {
        if (palabraAdivinada[i] === '_' && !letrasPorAdivinar.includes(palabraSecreta[i])) {
            letrasPorAdivinar.push(palabraSecreta[i]);
        }
    }
    
    if (letrasPorAdivinar.length > 0) {
        // Seleccionar una letra aleatoria para dar como pista
        const letraPista = letrasPorAdivinar[Math.floor(Math.random() * letrasPorAdivinar.length)];
        
        // Mostrar pista
        messageElement.textContent = `Pista: La palabra contiene la letra "${letraPista}"`;
        messageElement.style.color = "orange";
        
        // Esperar 3 segundos y luego ocultar pista
        setTimeout(() => {
            messageElement.textContent = "";
        }, 3000);
    }
}

// Navegación suave para enlaces internos
function initSmoothScroll() {
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
}

// Formulario de contacto simulado
function initContactButtons() {
    document.querySelectorAll('.btn').forEach(btn => {
        if (btn.id !== 'hintBtn' && btn.id !== 'resetBtn') {
            btn.addEventListener('click', function() {
                alert('Función de contacto simulada. En una implementación real, aquí se enviaría el formulario.');
            });
        }
    });
}

// Inicializar todo cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Iniciar el juego
    iniciarJuego();
    
    // Configurar event listeners
    hintBtn.addEventListener('click', darPista);
    resetBtn.addEventListener('click', iniciarJuego);
    
    // Configurar navegación suave
    initSmoothScroll();
    
    // Configurar botones de contacto
    initContactButtons();
    
    // Agregar funcionalidad de teclado físico
    document.addEventListener('keydown', function(event) {
        if (juegoTerminado) return;
        
        const tecla = event.key.toUpperCase();
        if (/^[A-Z]$/.test(tecla) && !letrasUsadas.includes(tecla)) {
            adivinarLetra(tecla);
        }
    });
});

// Función para mostrar información del estudiante (puedes personalizar)
function mostrarInformacionEstudiante() {
    console.log("Examen Parcial - Generación de Contenidos Multimedia");
    console.log("Estudiante: [Nombre Completo]");
    console.log("Carné: [Número de Carné]");
    console.log("Carrera: [Nombre de la Carrera]");
    console.log("Fecha: [Fecha de Entrega]");
}

// Llamar a la función para mostrar información (opcional)
mostrarInformacionEstudiante();