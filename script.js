// Script para la historia interactiva de Caperucita Roja
// Implementando buenas prácticas de GSAP y estructura modular

document.addEventListener('DOMContentLoaded', function() {
    console.log('¡El proyecto de Caperucita Roja está listo!');
    
    // Estado de la aplicación
    const app = {
        currentScene: 1,
        totalScenes: 2, // Ahora tenemos dos escenas
        animations: {},
        elements: {
            prevBtn: document.getElementById('prev-btn'),
            nextBtn: document.getElementById('next-btn'),
            indicators: document.querySelector('.scene-indicators'),
            scenes: document.querySelectorAll('.scene'),
            caperucitaTriangle: document.querySelector('.caperucita-triangle')
        }
    };
    
    // Inicializar animaciones y eventos
    initAnimations();
    setupEventListeners();
    
    // Iniciar la primera escena
    playSceneAnimation(app.currentScene);
    
    /**
     * Configuración de todas las animaciones con GSAP
     * Buena práctica: Organizar animaciones en timelines y mantenerlas separadas
     */
    function initAnimations() {
        // Timeline para la primera escena
        const scene1Timeline = gsap.timeline({
            paused: true, // Inicialmente pausada hasta que se active
            defaults: {
                duration: 0.8,
                ease: "power1.out"
            }
        });
        
        // Animación del fondo (césped)
        scene1Timeline.fromTo("#grass-layer", 
            { opacity: 0 },
            { opacity: 1 }
        );
        
        // Animación para Caperucita (triángulo rojo)
        scene1Timeline.fromTo("#scene-1 .caperucita-triangle", 
            { 
                opacity: 0, 
                y: 50,
                rotation: -20
            },
            { 
                opacity: 1, 
                y: 0,
                rotation: 0
            },
            "-=0.4" // Superposición con la animación anterior
        );
        
        // Animación del texto
        scene1Timeline.fromTo("#scene-1 .scene-text", 
            { 
                opacity: 0, 
                y: 20 
            },
            { 
                opacity: 1, 
                y: 0 
            },
            "-=0.2"
        );
        
        // Guardar la timeline en el estado de la app
        app.animations.scene1 = scene1Timeline;
        
        // Timeline para la segunda escena
        const scene2Timeline = gsap.timeline({
            paused: true,
            defaults: {
                duration: 0.8,
                ease: "power1.out"
            }
        });
        
        // Animación del fondo (césped) para la segunda escena
        scene2Timeline.fromTo("#grass-layer-2", 
            { opacity: 0 },
            { opacity: 1 }
        );
        
        // Animación inicial para Caperucita (triángulo rojo) en la segunda escena
        scene2Timeline.fromTo("#scene-2 .caperucita-triangle", 
            { 
                opacity: 0, 
                x: 0,
                y: 0,
                rotation: -10
            },
            { 
                opacity: 1, 
                x: 0,
                y: 0,
                rotation: 0
            },
            "-=0.4"
        );
        
        // Animación del texto en la segunda escena
        scene2Timeline.fromTo("#scene-2 .scene-text", 
            { 
                opacity: 0, 
                y: 20 
            },
            { 
                opacity: 1, 
                y: 0 
            },
            "-=0.2"
        );
        
        // Desplazamiento de izquierda a derecha (duración 5 segundos)
        scene2Timeline.to("#scene-2 .caperucita-triangle", {
            x: window.innerWidth - 180, // Ajustamos para que no se salga del contenedor
            duration: 5,
            ease: "none", // Movimiento constante
            delay: 0.5 // Pequeña pausa antes de comenzar el movimiento
        });
        
        // Guardar la timeline de la segunda escena
        app.animations.scene2 = scene2Timeline;
        
        // Animación para el título principal
        gsap.fromTo(".main-title", 
            { 
                opacity: 0, 
                y: -30 
            }, 
            { 
                opacity: 1, 
                y: 0, 
                duration: 1, 
                ease: "elastic.out(1, 0.5)" 
            }
        );
    }
    
    /**
     * Configurar los event listeners para la navegación entre escenas
     */
    function setupEventListeners() {
        // Botón anterior
        app.elements.prevBtn.addEventListener('click', () => {
            if (app.currentScene > 1) {
                navigateToScene(app.currentScene - 1);
            }
        });
        
        // Botón siguiente
        app.elements.nextBtn.addEventListener('click', () => {
            if (app.currentScene < app.totalScenes) {
                navigateToScene(app.currentScene + 1);
            }
        });
        
        // Indicadores de escena
        document.querySelectorAll('.indicator').forEach(indicator => {
            indicator.addEventListener('click', () => {
                const sceneNum = parseInt(indicator.getAttribute('data-scene'));
                navigateToScene(sceneNum);
            });
        });
    }
    
    /**
     * Navegar a una escena específica
     * @param {number} sceneNum - Número de la escena a mostrar
     */
    function navigateToScene(sceneNum) {
        if (sceneNum === app.currentScene) return;
        
        // Ocultar escena actual
        document.getElementById(`scene-${app.currentScene}`).style.display = 'none';
        
        // Actualizar estado
        app.currentScene = sceneNum;
        
        // Mostrar nueva escena
        document.getElementById(`scene-${app.currentScene}`).style.display = 'flex';
        
        // Actualizar los botones de navegación
        updateNavigationButtons();
        
        // Actualizar indicadores
        updateIndicators();
        
        // Reproducir la animación de la escena
        playSceneAnimation(sceneNum);
    }
    
    /**
     * Reproducir la animación correspondiente a la escena
     * @param {number} sceneNum - Número de la escena a animar
     */
    function playSceneAnimation(sceneNum) {
        // Reiniciar y reproducir la timeline correspondiente
        const timeline = app.animations[`scene${sceneNum}`];
        
        if (timeline) {
            timeline.restart();
        }
    }
    
    /**
     * Actualizar estados de los botones de navegación
     */
    function updateNavigationButtons() {
        app.elements.prevBtn.disabled = (app.currentScene <= 1);
        app.elements.nextBtn.disabled = (app.currentScene >= app.totalScenes);
    }
    
    /**
     * Actualizar los indicadores de escena
     */
    function updateIndicators() {
        document.querySelectorAll('.indicator').forEach(indicator => {
            const sceneNum = parseInt(indicator.getAttribute('data-scene'));
            
            if (sceneNum === app.currentScene) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    // Añadir efecto de hover utilizando GSAP
    const caperucitaElements = document.querySelectorAll('.caperucita-triangle');
    
    // Usar GSAP para efectos de hover en todos los triángulos de Caperucita
    caperucitaElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            gsap.to(element, { 
                scale: 1.2, 
                rotation: 5, 
                duration: 0.3, 
                ease: "power1.out" 
            });
        });
        
        element.addEventListener('mouseleave', () => {
            gsap.to(element, { 
                scale: 1, 
                rotation: 0, 
                duration: 0.3, 
                ease: "power1.out" 
            });
        });
    });
});
