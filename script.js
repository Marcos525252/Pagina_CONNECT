// === FUNCIONES INICIALES ===
function empezar() {
  alert("\u00a1Bienvenido a CONNECT!");
}

function buscarSe\u00f1a() {
  const input = document.getElementById("buscador").value.toLowerCase();
  const items = document.querySelectorAll(".item-se\u00f1a");
  items.forEach(item => {
    const palabra = item.getAttribute("data-palabra");
    item.style.display = palabra.includes(input) ? "block" : "none";
  });
}

// === COMUNIDAD ===
document.addEventListener("DOMContentLoaded", () => {
  const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
  comentarios.forEach(c => mostrarComentario(c.nombre, c.mensaje));
});

document.getElementById("comentario-form").addEventListener("submit", e => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const mensaje = document.getElementById("comentario").value.trim();
  if (!nombre || !mensaje) return alert("Completa ambos campos.");
  mostrarComentario(nombre, mensaje);
  guardarComentario(nombre, mensaje);
  document.getElementById("nombre").value = "";
  document.getElementById("comentario").value = "";
});

function mostrarComentario(nombre, mensaje) {
  const div = document.createElement("div");
  div.classList.add("comentario");
  div.innerHTML = `<strong>${nombre}</strong><p>${mensaje}</p>`;
  document.getElementById("lista-comentarios").prepend(div);
}

function guardarComentario(nombre, mensaje) {
  const comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];
  comentarios.push({ nombre, mensaje });
  localStorage.setItem("comentarios", JSON.stringify(comentarios));
}

// === LECCIONES ===
const leccionesPorModulo = {
  basico: [
    {
      id: "saludo",
      imagen: "img/saludo.png",
      titulo: "\u00bfCu\u00e1l de estas palabras representa esta se\u00f1a?",
      opciones: ["Hola", "Adi\u00f3s", "Silencio"],
      respuestaCorrecta: "Hola"
    },
    {
      id: "familia",
      imagen: "img/familia.png",
      titulo: "\u00bfQu\u00e9 representa esta se\u00f1a?",
      opciones: ["Familia", "Escuela", "Doctor"],
      respuestaCorrecta: "Familia"
    }
  ],
  intermedio: [
    {
      id: "comida",
      imagen: "img/comida.png",
      titulo: "Esta se\u00f1a es com\u00fan en entornos cotidianos. \u00bfQu\u00e9 significa?",
      opciones: ["Comida", "Cocinar", "Comedor"],
      respuestaCorrecta: "Comida"
    },
    {
      id: "hospital",
      imagen: "img/hospital.png",
      titulo: "Relaciona correctamente esta se\u00f1a con su concepto.",
      opciones: ["Hospital", "Farmacia", "Ambulancia"],
      respuestaCorrecta: "Hospital"
    }
  ],
  avanzado: [
    {
      id: "constitucion",
      imagen: "img/constitucion.png",
      titulo: "Interpreta esta se\u00f1a: se usa en contextos legales o ciudadanos.",
      opciones: ["Constituci\u00f3n", "Justicia", "Democracia"],
      respuestaCorrecta: "Constituci\u00f3n"
    },
    {
      id: "inclusion",
      imagen: "img/inclusion.png",
      titulo: "\u00bfCu\u00e1l es el concepto representado por esta se\u00f1a compleja?",
      opciones: ["Equidad", "Integraci\u00f3n", "Inclusi\u00f3n"],
      respuestaCorrecta: "Inclusi\u00f3n"
    }
  ]
};

let moduloActual = "";

function mostrarModulo(nivel) {
  if (!nivelDisponible(nivel)) {
    alert("Este m\u00f3dulo est\u00e1 bloqueado. Completa el anterior para desbloquearlo.");
    return;
  }

  moduloActual = nivel;
  const contenedor = document.getElementById("contenedor-lecciones");
  contenedor.innerHTML = "";

  if (!leccionesPorModulo[nivel]) {
    contenedor.innerHTML = "<p>No hay lecciones disponibles.</p>";
    return;
  }

  leccionesPorModulo[nivel].forEach(leccion => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-leccion";
    tarjeta.innerHTML = `
      <img src="${leccion.imagen}" alt="Imagen de lecci\u00f3n" />
      <h4>${leccion.titulo}</h4>
      <button onclick="leerTexto('${leccion.titulo}')">🔊 Escuchar</button>
      <form onchange="iniciarTemporizador('${leccion.id}')">
        ${leccion.opciones.map(op => `
          <label><input type="radio" name="respuesta-${leccion.id}" value="${op}"> ${op}</label>
        `).join("")}
        <button type="button" onclick="verificar('${leccion.id}', '${leccion.respuestaCorrecta}')">Verificar</button>
      </form>
      <p class="feedback" id="feedback-${leccion.id}"></p>
    `;
    contenedor.appendChild(tarjeta);
  });

  actualizarProgreso(nivel);
}

function verificar(id, correcta) {
  const radios = document.getElementsByName(`respuesta-${id}`);
  let seleccion = null;
  for (let r of radios) {
    if (r.checked) {
      seleccion = r.value;
      break;
    }
  }

  const feedback = document.getElementById(`feedback-${id}`);
  if (!seleccion) {
    feedback.textContent = "Selecciona una respuesta.";
    feedback.style.color = "orange";
  } else if (seleccion === correcta) {
    feedback.textContent = "\u00a1Correcto!";
    feedback.style.color = "green";

    const respuestas = JSON.parse(localStorage.getItem(`resueltas-${moduloActual}`)) || [];
    if (!respuestas.includes(id)) {
      respuestas.push(id);
      localStorage.setItem(`resueltas-${moduloActual}`, JSON.stringify(respuestas));
    }

    registrarEstadistica(moduloActual, id, true);
    actualizarProgreso(moduloActual);
  } else {
    feedback.textContent = "Incorrecto. Intenta de nuevo.";
    feedback.style.color = "red";
    registrarEstadistica(moduloActual, id, false);
  }
}

function actualizarProgreso(nivel) {
  const total = leccionesPorModulo[nivel].length;
  const respuestas = JSON.parse(localStorage.getItem(`resueltas-${nivel}`)) || [];
  const porcentaje = Math.round((respuestas.length / total) * 100);

  document.getElementById("barra-interna").style.width = porcentaje + "%";
  document.getElementById("porcentaje-progreso").textContent = `${porcentaje}% completado`;

  if (porcentaje === 100) {
    localStorage.setItem(`modulo-${nivel}-completado`, "true");
    desbloquearSiguienteModulo(nivel);
    setTimeout(() => {
      alert("🎉 \u00a1Felicidades! Has completado todas las lecciones de este m\u00f3dulo.");
    }, 300);
  }
  actualizarBloqueoVisual();
}

function iniciarTemporizador(id) {
  let tiempo = 15;
  const feedback = document.getElementById(`feedback-${id}`);
  const intervalo = setInterval(() => {
    tiempo--;
    if (tiempo > 0) {
      feedback.textContent = `⏳ ${tiempo} segundos restantes...`;
      feedback.style.color = "gray";
    } else {
      clearInterval(intervalo);
      feedback.textContent = "⛔ Tiempo agotado. Intenta otra lecci\u00f3n.";
      feedback.style.color = "darkred";
      desactivarOpciones(id);
    }
  }, 1000);
}

function desactivarOpciones(id) {
  const radios = document.getElementsByName(`respuesta-${id}`);
  radios.forEach(r => r.disabled = true);
}

function reiniciarModulo() {
  if (!moduloActual) return alert("Selecciona primero un m\u00f3dulo.");
  localStorage.removeItem(`resueltas-${moduloActual}`);
  localStorage.removeItem(`estadisticas-${moduloActual}`);
  localStorage.removeItem(`modulo-${moduloActual}-completado`);
  alert(`Se ha reiniciado el m\u00f3dulo ${moduloActual.toUpperCase()}.`);
  mostrarModulo(moduloActual);
  actualizarBloqueoVisual();
}

function registrarEstadistica(modulo, id, acierto) {
  const clave = `estadisticas-${modulo}`;
  let stats = JSON.parse(localStorage.getItem(clave)) || { aciertos: 0, errores: 0 };
  if (acierto) stats.aciertos++;
  else stats.errores++;
  localStorage.setItem(clave, JSON.stringify(stats));
}

function leerTexto(texto) {
  const speech = new SpeechSynthesisUtterance(texto);
  speech.lang = "es-PE";
  window.speechSynthesis.speak(speech);
}

// === BLOQUEO DE MÓDULOS ===
function nivelDisponible(nivel) {
  if (nivel === "basico") return true;
  if (nivel === "intermedio") return localStorage.getItem("modulo-basico-completado") === "true";
  if (nivel === "avanzado") return localStorage.getItem("modulo-intermedio-completado") === "true";
  return false;
}

function desbloquearSiguienteModulo(nivel) {
  if (nivel === "basico") localStorage.setItem("modulo-intermedio-desbloqueado", "true");
  if (nivel === "intermedio") localStorage.setItem("modulo-avanzado-desbloqueado", "true");
}

function actualizarBloqueoVisual() {
  const modulos = ["basico", "intermedio", "avanzado"];
  modulos.forEach(nivel => {
    const elemento = document.querySelector(`.modulo[onclick*="${nivel}"]`);
    if (!nivelDisponible(nivel)) {
      elemento.classList.add("bloqueado");
    } else {
      elemento.classList.remove("bloqueado");
    }
  });
}

document.addEventListener("DOMContentLoaded", actualizarBloqueoVisual);

// === MODO DESAFÍO GLOBAL ===
function iniciarDesafio() {
  const preguntas = Object.values(leccionesPorModulo).flat();
  const seleccionadas = preguntas.sort(() => Math.random() - 0.5).slice(0, 5);
  const contenedor = document.getElementById("contenedor-desafio");
  const resultado = document.getElementById("resultado-desafio");
  contenedor.innerHTML = "";
  resultado.textContent = "";

  let puntaje = 0;
  let actual = 0;

  function mostrarPregunta() {
    if (actual >= seleccionadas.length) {
      resultado.textContent = `\ud83c\udf1f Desaf\u00edo completado. Puntaje final: ${puntaje} de 5`;
      return;
    }

    const l = seleccionadas[actual];
    contenedor.innerHTML = `
      <div class="tarjeta-desafio">
        <img src="${l.imagen}" alt="Se\u00f1a">
        <h4>${l.titulo}</h4>
        ${l.opciones.map(op => `
          <button onclick="verificarDesafio('${op}', '${l.respuestaCorrecta}')">${op}</button>
        `).join("")}
        <p id="feedback-desafio"></p>
        <p id="temporizador-desafio">⏳ 10</p>
      </div>
    `;

    let tiempo = 10;
    const temporizador = document.getElementById("temporizador-desafio");
    const intervalo = setInterval(() => {
      tiempo--;
      if (tiempo > 0) {
        temporizador.textContent = `⏳ ${tiempo}`;
      } else {
        clearInterval(intervalo);
        document.getElementById("feedback-desafio").textContent = "⛔ Tiempo agotado.";
        actual++;
        setTimeout(mostrarPregunta, 1000);
      }
    }, 1000);

    window.verificarDesafio = (seleccion, correcta) => {
      clearInterval(intervalo);
      const feedback = document.getElementById("feedback-desafio");
      if (seleccion === correcta) {
        feedback.textContent = "✅ Correcto!";
        puntaje++;
      } else {
        feedback.textContent = `❌ Incorrecto. Era: ${correcta}`;
      }
      actual++;
      setTimeout(mostrarPregunta, 1000);
    };
  }

  mostrarPregunta();
}

function mostrarEstadisticas() {
  const tabla = document.querySelector("#tabla-estadisticas tbody");
  tabla.innerHTML = "";
  const modulos = Object.keys(leccionesPorModulo);
  modulos.forEach(modulo => {
    const stats = JSON.parse(localStorage.getItem(`estadisticas-${modulo}`)) || { aciertos: 0, errores: 0 };
    const total = stats.aciertos + stats.errores;
    const efectividad = total > 0 ? Math.round((stats.aciertos / total) * 100) + "%" : "0%";
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${modulo.charAt(0).toUpperCase() + modulo.slice(1)}</td>
      <td>${stats.aciertos}</td>
      <td>${stats.errores}</td>
      <td>${efectividad}</td>
    `;
    tabla.appendChild(fila);
  });
}

// === MULTILENGUAJE: traducciones de interfaz (no lecciones) ===
const traducciones = {
  es: {
    "connect": "CONNECT",
    "nav-inicio": "Inicio",
    "nav-modulos": "Módulos",
    "nav-glosario": "Glosario",
    "nav-lecciones": "Lecciones",
    "nav-minijuego": "Minijuego",
    "nav-desafio": "Desafío",
    "nav-estadisticas": "Estadísticas",
    "nav-comunidad": "Comunidad",
    "banner-titulo": "Conectando a través de la Lengua de Señas Peruana",
    "banner-desc": "Una plataforma inclusiva para personas sordas y oyentes en Chepén",
    "btn-empezar": "¡Empieza a aprender!",
    "titulo-modulos": "Módulos de Aprendizaje",
    "modulo-basico": "Básico",
    "modulo-basico-desc": "Lecciones fáciles para empezar desde cero.",
    "modulo-intermedio": "Intermedio",
    "modulo-intermedio-desc": "Ejercicios para razonar y aplicar vocabulario cotidiano.",
    "modulo-avanzado": "Avanzado",
    "modulo-avanzado-desc": "Desafíos complejos y vocabulario abstracto.",
    "titulo-glosario": "Glosario Visual de Señas",
    "titulo-lecciones": "Lecciones por Módulo",
    "selecciona-modulo": "Selecciona un módulo para ver sus lecciones.",
    "progreso-titulo": "Progreso del módulo seleccionado:",
    "btn-reiniciar": "🔄 Reiniciar módulo",
    "titulo-memorama": "🧠 Minijuego de Repaso: Memorama",
    "descripcion-memorama": "Haz clic en las cartas para encontrar las parejas correctas.",
    "btn-memorama": "🔁 Iniciar juego",
    "titulo-desafio": "🎯 Modo Desafío Global",
    "descripcion-desafio": "Responde 5 preguntas aleatorias contra el reloj. ¡Demuestra tus habilidades!",
    "btn-desafio": "🚀 Iniciar Desafío",
    "titulo-estadisticas": "📊 Estadísticas por Módulo",
    "btn-estadisticas": "🔍 Ver estadísticas",
    "tabla-modulo": "Módulo",
    "tabla-aciertos": "Aciertos",
    "tabla-errores": "Errores",
    "tabla-efectividad": "Efectividad",
    "titulo-comunidad": "Comunidad CONNECT",
    "descripcion-comunidad": "Comparte tus experiencias o dudas. ¡Conectemos aprendiendo juntos!",
    "btn-publicar": "Publicar",
    "footer": "© 2025 CONNECT | Plataforma de aprendizaje inclusivo"
  },
  en: {
    "connect": "CONNECT",
    "nav-inicio": "Home",
    "nav-modulos": "Modules",
    "nav-glosario": "Glossary",
    "nav-lecciones": "Lessons",
    "nav-minijuego": "Minigame",
    "nav-desafio": "Challenge",
    "nav-estadisticas": "Statistics",
    "nav-comunidad": "Community",
    "banner-titulo": "Connecting through Peruvian Sign Language",
    "banner-desc": "An inclusive platform for deaf and hearing people in Chepén",
    "btn-empezar": "Start learning!",
    "titulo-modulos": "Learning Modules",
    "modulo-basico": "Basic",
    "modulo-basico-desc": "Easy lessons to start from scratch.",
    "modulo-intermedio": "Intermediate",
    "modulo-intermedio-desc": "Exercises to reason and apply daily vocabulary.",
    "modulo-avanzado": "Advanced",
    "modulo-avanzado-desc": "Challenging topics and abstract vocabulary.",
    "titulo-glosario": "Visual Sign Glossary",
    "titulo-lecciones": "Lessons by Module",
    "selecciona-modulo": "Select a module to view its lessons.",
    "progreso-titulo": "Selected module progress:",
    "btn-reiniciar": "🔄 Reset module",
    "titulo-memorama": "🧠 Review Minigame: Memory Match",
    "descripcion-memorama": "Click the cards to find the matching pairs.",
    "btn-memorama": "🔁 Start game",
    "titulo-desafio": "🎯 Global Challenge Mode",
    "descripcion-desafio": "Answer 5 random questions against the clock. Show your skills!",
    "btn-desafio": "🚀 Start Challenge",
    "titulo-estadisticas": "📊 Module Statistics",
    "btn-estadisticas": "🔍 View statistics",
    "tabla-modulo": "Module",
    "tabla-aciertos": "Correct",
    "tabla-errores": "Incorrect",
    "tabla-efectividad": "Accuracy",
    "titulo-comunidad": "CONNECT Community",
    "descripcion-comunidad": "Share your experiences or questions. Let's connect and learn together!",
    "btn-publicar": "Post",
    "footer": "© 2025 CONNECT | Inclusive learning platform"
  }
};

function cambiarIdioma(idioma) {
  localStorage.setItem("idioma", idioma);
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const clave = el.getAttribute("data-i18n");
    if (traducciones[idioma] && traducciones[idioma][clave]) {
      el.textContent = traducciones[idioma][clave];
    }
  });
}

// Aplicar idioma guardado al cargar
document.addEventListener("DOMContentLoaded", () => {
  const idiomaGuardado = localStorage.getItem("idioma") || "es";
  cambiarIdioma(idiomaGuardado);
});


// === EXPOSICIÓN GLOBAL ===
window.mostrarModulo = mostrarModulo;
window.verificar = verificar;
window.empezar = empezar;
window.buscarSe\u00f1a = buscarSe\u00f1a;
window.leerTexto = leerTexto;
window.reiniciarModulo = reiniciarModulo;
window.mostrarEstadisticas = mostrarEstadisticas;
window.iniciarDesafio = iniciarDesafio;


function guardarNombreUsuario() {
  const nombre = document.getElementById("nombre-usuario").value.trim();
  if (nombre) {
    localStorage.setItem("nombreUsuario", nombre);
    mostrarNombreUsuario();
  }
}

function mostrarNombreUsuario() {
  const nombre = localStorage.getItem("nombreUsuario") || "Invitado";
  document.getElementById("nombre-mostrado").textContent = `Bienvenido, ${nombre}`;
}

function calcularEstadisticasGlobales() {
  const modulos = Object.keys(leccionesPorModulo);
  let aciertos = 0;
  let errores = 0;

  modulos.forEach(mod => {
    const stats = JSON.parse(localStorage.getItem(`estadisticas-${mod}`)) || { aciertos: 0, errores: 0 };
    aciertos += stats.aciertos;
    errores += stats.errores;
  });

  const total = aciertos + errores;
  const efectividad = total > 0 ? Math.round((aciertos / total) * 100) : 0;

  document.getElementById("global-aciertos").textContent = aciertos;
  document.getElementById("global-errores").textContent = errores;
  document.getElementById("global-efectividad").textContent = `${efectividad}%`;
}

function borrarTodo() {
  if (confirm("¿Seguro que deseas borrar todo tu progreso y estadísticas?")) {
    localStorage.clear();
    location.reload();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  mostrarNombreUsuario();
  calcularEstadisticasGlobales();
});

// === MINIJUEGOS DE REPASO MEJORADOS ===

const repasoDatos = [
  { palabra: "Hola", imagen: "img/hola.png" },
  { palabra: "Familia", imagen: "img/familia.png" },
  { palabra: "Comida", imagen: "img/comida.png" },
  { palabra: "Hospital", imagen: "img/hospital.png" }
];

let puntajeRepaso = 0;
let tiempoRestante = 90;
let temporizadorRepaso = null;

function iniciarMinijuegos() {
  puntajeRepaso = 0;
  tiempoRestante = 90;
  document.getElementById("puntaje-repaso").textContent = `Puntaje total: 0 de 3`;
  document.getElementById("resultado-dragdrop").textContent = "";
  document.getElementById("resultado-completar").textContent = "";
  document.getElementById("resultado-imagen").textContent = "";

  iniciarTemporizadorRepaso();
  iniciarDragDrop();
  iniciarCompletarPalabra();
  iniciarSeleccionImagen();
}

function iniciarTemporizadorRepaso() {
  clearInterval(temporizadorRepaso);
  temporizadorRepaso = setInterval(() => {
    tiempoRestante--;
    document.getElementById("temporizador-repaso").textContent = `⏳ ${tiempoRestante} segundos`;
    if (tiempoRestante <= 0) {
      clearInterval(temporizadorRepaso);
      finalizarMinijuegos();
    }
  }, 1000);
}

function finalizarMinijuegos() {
  document.getElementById("puntaje-repaso").textContent = `⏰ Tiempo agotado. Puntaje final: ${puntajeRepaso} de 3`;
  document.getElementById("temporizador-repaso").textContent = "⛔ Tiempo finalizado.";
}

function iniciarDragDrop() {
  const dragItems = document.getElementById("drag-items");
  const dropTargets = document.getElementById("drop-targets");
  dragItems.innerHTML = "";
  dropTargets.innerHTML = "";

  const palabras = [...repasoDatos];
  const definiciones = [...repasoDatos].sort(() => Math.random() - 0.5);

  palabras.forEach(item => {
    const div = document.createElement("div");
    div.className = "drag";
    div.textContent = item.palabra;
    div.draggable = true;
    div.ondragstart = e => e.dataTransfer.setData("text", item.palabra);
    dragItems.appendChild(div);
  });

  definiciones.forEach(item => {
    const div = document.createElement("div");
    div.className = "drop";
    div.textContent = `Seña: ${item.palabra}`;
    div.ondragover = e => e.preventDefault();
    div.ondrop = e => {
      const data = e.dataTransfer.getData("text");
      if (data === item.palabra) {
        div.textContent = `✅ ${item.palabra}`;
        div.style.backgroundColor = "#d4ffd4";
        document.getElementById("resultado-dragdrop").textContent = "¡Correcto!";
        puntajeRepaso++;
        actualizarPuntajeRepaso();
      } else {
        div.style.backgroundColor = "#ffd4d4";
        document.getElementById("resultado-dragdrop").textContent = "❌ Incorrecto.";
      }
    };
    dropTargets.appendChild(div);
  });
}

function iniciarCompletarPalabra() {
  const aleatorio = repasoDatos[Math.floor(Math.random() * repasoDatos.length)];
  const img = document.getElementById("imagen-completar");
  img.src = aleatorio.imagen;
  img.dataset.respuesta = aleatorio.palabra;

  const input = document.getElementById("input-completar");
  input.value = "";
  input.onkeydown = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      verificarCompletar();
    }
  };
}

function verificarCompletar() {
  const userInput = document.getElementById("input-completar").value.trim();
  const correcta = document.getElementById("imagen-completar").dataset.respuesta;
  const resultado = document.getElementById("resultado-completar");
  if (userInput.toLowerCase() === correcta.toLowerCase()) {
    resultado.textContent = "✅ ¡Correcto!";
    puntajeRepaso++;
    actualizarPuntajeRepaso();
  } else {
    resultado.textContent = `❌ Incorrecto. Era: ${correcta}`;
  }
}

function iniciarSeleccionImagen() {
  const palabra = repasoDatos[Math.floor(Math.random() * repasoDatos.length)].palabra;
  document.getElementById("palabra-imagen").textContent = `¿Cuál imagen representa: ${palabra}?`;
  const opcionesContenedor = document.getElementById("opciones-imagen");
  opcionesContenedor.innerHTML = "";
  const opciones = [...repasoDatos].sort(() => Math.random() - 0.5);
  opciones.forEach(op => {
    const img = document.createElement("img");
    img.src = op.imagen;
    img.alt = op.palabra;
    img.onclick = () => {
      const resultado = document.getElementById("resultado-imagen");
      if (op.palabra === palabra) {
        resultado.textContent = "✅ ¡Correcto!";
        puntajeRepaso++;
        actualizarPuntajeRepaso();
      } else {
        resultado.textContent = `❌ Incorrecto. Era: ${palabra}`;
      }
    };
    opcionesContenedor.appendChild(img);
  });
}

function actualizarPuntajeRepaso() {
  document.getElementById("puntaje-repaso").textContent = `Puntaje total: ${puntajeRepaso} de 3`;
  if (puntajeRepaso >= 3) {
    clearInterval(temporizadorRepaso);
    document.getElementById("temporizador-repaso").textContent = "🎉 ¡Minijuegos completados!";
  }
}

function iniciarMemorama() {
  const tablero = document.getElementById("tablero-memorama");
  const mensaje = document.getElementById("mensaje-memorama");
  tablero.innerHTML = "";
  mensaje.textContent = "";

  // Palabras para el memorama
  const pares = [
    { palabra: "Hola", imagen: "img/hola.png" },
    { palabra: "Familia", imagen: "img/familia.png" },
    { palabra: "Comida", imagen: "img/comida.png" },
    { palabra: "Hospital", imagen: "img/hospital.png" }
  ];

  // Duplicar y mezclar las cartas
  const cartas = [...pares, ...pares].sort(() => Math.random() - 0.5);
  let seleccionadas = [];
  let aciertos = 0;

  cartas.forEach((item, index) => {
    const carta = document.createElement("div");
    carta.className = "carta";
    carta.dataset.palabra = item.palabra;
    carta.innerHTML = `<img src="${item.imagen}" alt="${item.palabra}" />`;
    carta.onclick = () => {
      if (carta.classList.contains("abierta") || seleccionadas.length >= 2) return;
      carta.classList.add("abierta");
      seleccionadas.push(carta);

      if (seleccionadas.length === 2) {
        const [c1, c2] = seleccionadas;
        if (c1.dataset.palabra === c2.dataset.palabra) {
          aciertos++;
          seleccionadas = [];
          if (aciertos === pares.length) {
            mensaje.textContent = "🎉 ¡Memorama completado!";
          }
        } else {
          setTimeout(() => {
            c1.classList.remove("abierta");
            c2.classList.remove("abierta");
            seleccionadas = [];
          }, 800);
        }
      }
    };
    tablero.appendChild(carta);
  });
}
