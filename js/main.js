/* ==========================================================================
   CONFIGURACIÓN Y EVENTOS PRINCIPALES DE JAVASCRIPT
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. PANTALLA DE CARGA (PRELOADER) --- */
    const preloader = document.getElementById('pantalla-carga');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('oculto');
        }, 2000); 
    }

    /* --- 2. CONTROL DE ENVÍO DE FORMULARIO CON WEB3FORMS (AJAX) --- */
    const formContacto = document.getElementById('form-contacto');
    const mensajeRespuesta = document.getElementById('mensaje-respuesta');
    const btnEnviar = document.getElementById('btn-enviar');

    if (formContacto) {
        formContacto.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Estado visual de carga en el botón
            btnEnviar.value = 'Enviando...';
            btnEnviar.disabled = true;

            const formData = new FormData(formContacto);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                const res = await response.json();
                if (response.status === 200) {
                    mensajeRespuesta.style.display = "block";
                    mensajeRespuesta.style.color = "#27c93f"; // Verde Apple
                    mensajeRespuesta.innerHTML = "¡Gracias! Tu mensaje se ha enviado con éxito.";
                    formContacto.reset();
                } else {
                    mensajeRespuesta.style.display = "block";
                    mensajeRespuesta.style.color = "#ff5f56"; // Rojo
                    mensajeRespuesta.innerHTML = res.message || "Hubo un error al enviar. Inténtalo de nuevo.";
                }
            })
            .catch(() => {
                mensajeRespuesta.style.display = "block";
                mensajeRespuesta.style.color = "#ff5f56";
                mensajeRespuesta.innerHTML = "Error de conexión. Por favor verifica tu red.";
            })
            .finally(() => {
                // Restaurar botón y ocultar mensaje a los 5 segundos
                btnEnviar.value = '¡Enviar!';
                btnEnviar.disabled = false;
                setTimeout(() => {
                    if (mensajeRespuesta) {
                        mensajeRespuesta.style.display = "none";
                    }
                }, 5000);
            });
        });
    }

    /* --- 3. EFECTO TYPEWRITER (TYPING TEXT) EN EL HERO --- */
    const elementoTexto = document.getElementById('texto-tipeado');
    if (elementoTexto) {
        const frases = [
            "marketer & content creator",
            "audiovisual producer",
            "digital strategist"
        ];

        let indiceFrase = 0;
        let indiceCaracter = 0;
        let estaBorrando = false;
        const velocidadEscribir = 90;  // Velocidad por letra (ms)
        const velocidadBorrar = 40;     // Velocidad al borrar
        const pausaEspera = 2000;        // Tiempo que se queda la frase escrita (ms)

        function tipear() {
            const fraseActual = frases[indiceFrase];

            if (estaBorrando) {
                elementoTexto.textContent = fraseActual.substring(0, indiceCaracter - 1);
                indiceCaracter--;
            } else {
                elementoTexto.textContent = fraseActual.substring(0, indiceCaracter + 1);
                indiceCaracter++;
            }

            let tiempoDelay = estaBorrando ? velocidadBorrar : velocidadEscribir;

            if (!estaBorrando && indiceCaracter === fraseActual.length) {
                tiempoDelay = pausaEspera; 
                estaBorrando = true;
            } else if (estaBorrando && indiceCaracter === 0) {
                estaBorrando = false;
                indiceFrase = (indiceFrase + 1) % frases.length; 
                tiempoDelay = 400; 
            }

            setTimeout(tipear, tiempoDelay);
        }

        tipear();
    }

    /* ==========================================================================
   4. LÓGICA DE MODO OSCURO (DARK MODE) GLOBAL
   ========================================================================== */
function inicializarModoOscuro() {
    const btnDarkMode = document.getElementById('btn-dark-mode');
    
    // Buscamos los íconos tanto por ID como por clase para evitar discrepancias
    const sol = document.getElementById('svg-sol') || document.querySelector('.icono-sol');
    const luna = document.getElementById('svg-luna') || document.querySelector('.icono-luna');

    function actualizarIconos(esOscuro) {
        if (sol) sol.style.display = esOscuro ? 'block' : 'none';
        if (luna) luna.style.display = esOscuro ? 'none' : 'block';
    }

    // 1. Restaurar preferencia guardada en localStorage
    if (localStorage.getItem('byResa_theme') === 'dark') {
        document.body.classList.add('dark-mode');
        actualizarIconos(true);
    } else {
        actualizarIconos(false);
    }

    // 2. Escuchar el clic en el botón flotante
    if (btnDarkMode) {
        btnDarkMode.addEventListener('click', (e) => {
            e.preventDefault();
            const esOscuro = document.body.classList.toggle('dark-mode');
            localStorage.setItem('byResa_theme', esOscuro ? 'dark' : 'light');
            actualizarIconos(esOscuro);
        });
    }
}

// Asegurar ejecución una vez que el DOM esté completamente cargado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarModoOscuro);
} else {
    inicializarModoOscuro();
}
});