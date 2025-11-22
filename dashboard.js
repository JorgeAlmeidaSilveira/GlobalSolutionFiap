// =================================================================
// 1. CONFIGURAÇÕES E ESTADO DO POMODORO TIMER
// =================================================================

const TIMER_SETTINGS = {
    FOCUS: 25 * 60,
    BREAK: 5 * 60, 
    LONG_BREAK: 15 * 60,
    CIRCUMFERENCE: 2 * Math.PI * 90 
};

let timerId = null;
let totalSeconds = TIMER_SETTINGS.FOCUS;
let secondsRemaining = totalSeconds;
let isRunning = false;
let currentMode = 'focus';

// Elementos DOM
const timerDisplay = document.getElementById('timer-display');
const timerTitle = document.getElementById('timer-title');
const timerMessage = document.getElementById('timer-message');
const btnStart = document.getElementById('btn-start');
const btnReset = document.getElementById('btn-reset');
const timerCard = document.querySelector('.focus-timer-card');
const progressCircle = document.querySelector('.timer-progress');
const moodOptionsContainer = document.getElementById('mood-options');
// REMOVIDO: const moodFeedback = document.getElementById('mood-feedback'); 
// REMOVIDO: const ttsAudio = document.getElementById('tts-audio'); 


// Inicializa o SVG de progresso
progressCircle.style.strokeDasharray = TIMER_SETTINGS.CIRCUMFERENCE;
progressCircle.style.strokeDashoffset = TIMER_SETTINGS.CIRCUMFERENCE;


// =================================================================
// 2. FUNÇÕES DE UTILIDADE E CÁLCULO
// =================================================================

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateProgress() {
    const progress = secondsRemaining / totalSeconds;
    const offset = TIMER_SETTINGS.CIRCUMFERENCE * (1 - progress);
    progressCircle.style.strokeDashoffset = offset;
}

/**
 * Função principal do loop do timer (chamada a cada segundo).
 * Responsável por tocar o som QUANDO O TEMPO ATINGE ZERO.
 */
function tick() {
    if (secondsRemaining > 0) {
        secondsRemaining--;
        timerDisplay.textContent = formatTime(secondsRemaining);
        updateProgress();
    } else {
        // Ciclo Terminado
        stopTimer(false); 
        
        // 🔊 Toca o som de notificação quando o tempo atual (focus ou break) termina.
        playNotificationSound(); 

        // Mudar para o próximo modo
        if (currentMode === 'focus') {
            // Quando o Foco termina, muda para a Pausa E inicia a Pausa automaticamente
            switchMode('break', true); 
        } else {
            // Quando a Pausa termina, muda para o Foco E inicia o Foco automaticamente
            switchMode('focus', true); 
        }
    }
}

function playNotificationSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);

        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (error) {
        console.error("Erro ao tentar tocar som de notificação:", error);
    }
}


// =================================================================
// 3. CONTROLE DO TIMER E LÓGICA DE ESTADO
// =================================================================

/**
 * Alterna entre os modos 'focus' e 'break', e pode iniciar automaticamente.
 * @param {string} mode - O novo modo ('focus' ou 'break').
 * @param {boolean} autoStart - Se deve iniciar o timer imediatamente. (NOVA FUNCIONALIDADE)
 */
function switchMode(mode, autoStart = false) { 
    currentMode = mode;
    timerCard.dataset.mode = mode;

    if (mode === 'focus') {
        totalSeconds = TIMER_SETTINGS.FOCUS;
        timerTitle.textContent = "Focus Time";
        timerMessage.textContent = "Hora de Focar!";
    } else {
        totalSeconds = TIMER_SETTINGS.BREAK;
        timerTitle.textContent = "Break Time";
        timerMessage.textContent = "Pausa Ativa!";
    }
    
    // 🔊 Toca o som ao entrar no novo modo (Foco ou Pausa)
    if (autoStart) {
        playNotificationSound(); 
    }


    secondsRemaining = totalSeconds;
    timerDisplay.textContent = formatTime(secondsRemaining);
    updateProgress();
    
    // Ajusta o texto do botão
    btnStart.textContent = 'Start';
    btnStart.disabled = false;

    if (autoStart) {
        startPauseTimer();
    } else {
        timerMessage.textContent += " Clique Start.";
        btnStart.innerHTML = '▶️ Start';
    }
}

function startPauseTimer() {
    if (!isRunning) {
        isRunning = true;
        timerId = setInterval(tick, 1000);
        btnStart.innerHTML = '⏸️ Pause';
        timerMessage.textContent = currentMode === 'focus' ? "Focando..." : "Descansando...";
    } else {
        stopTimer(true);
        timerMessage.textContent = currentMode === 'focus' ? "Pausado. Continue!" : "Pausa pausada.";
        btnStart.innerHTML = '▶️ Continue';
    }
}

function stopTimer(updateButtonText = true) {
    isRunning = false;
    clearInterval(timerId);
    timerId = null;
    if (updateButtonText) {
        btnStart.innerHTML = '▶️ Continue';
    }
}

function resetTimer() {
    stopTimer(false);
    secondsRemaining = totalSeconds;
    timerDisplay.textContent = formatTime(secondsRemaining);
    updateProgress();
    
    timerMessage.textContent = currentMode === 'focus' ? "Clique Start!" : "Pausa Ativa! Clique Start.";
    btnStart.innerHTML = '▶️ Start';
}

btnStart.addEventListener('click', startPauseTimer);
btnReset.addEventListener('click', resetTimer);

window.onload = () => {
    resetTimer();
    setupMoodTracker();
};


// =================================================================
// 4. MÓDULO DE NOTIFICAÇÃO DE HUMOR (ESTÁTICO)
// =================================================================

/**
 * Cria e exibe uma notificação (toast) temporária na tela.
 * @param {string} message - A mensagem a ser exibida.
 * @param {string} icon - O ícone para a notificação.
 */
function showNotification(message, icon) {
    // 1. Criar o elemento da notificação
    const notification = document.createElement('div');
    notification.className = 'app-notification';
    // O 'message' agora é o shortMessage (emoji + texto)
    notification.innerHTML = `<span class="notification-icon">${icon}</span> ${message}`;

    // 2. Adicionar o elemento ao corpo do documento
    document.body.appendChild(notification);
    
    // 3. Forçar reflow para garantir a animação 'slide-in'
    notification.offsetHeight;

    // 4. Adicionar classe para exibir (animação CSS)
    notification.classList.add('show');

    // 5. Remover após 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        // Remover do DOM após a animação de 'slide-out' (aprox. 0.5s)
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}


const MOOD_MESSAGES = {
    otimo: {
        text: "Fantástico! Mantenha essa energia alta e concentre-se no seu objetivo. Você vai dominar a sua lista de tarefas!",
        icon: "✨",
        shortMessage: "Que energia! Vamos Focar!" // Nova mensagem curta com emoji
    },
    feliz: {
        text: "Que bom que você está feliz! Use esse bom humor para dar um passo extra hoje. Um passo de cada vez!",
        icon: "😊",
        shortMessage: "Foco e alegria para o dia!" // Nova mensagem curta com emoji
    },
    energizado: {
        text: "Com essa energia, você é imparável! Lembre-se de fazer pausas curtas para manter o ritmo sem esgotar. Ótimo trabalho!",
        icon: "⚡",
        shortMessage: "Energia total! Foco ativado!" // Nova mensagem curta com emoji
    },
    normal: {
        text: "Tudo bem estar normal. Isso significa estabilidade. Vamos usar esta base sólida para construir um dia produtivo e focado. Comece por um item fácil.",
        icon: "👍",
        shortMessage: "Estabilidade é a chave. Comece devagar." // Nova mensagem curta com emoji
    },
    cansado: {
        text: "Eu entendo. O cansaço acontece. Que tal começar com uma tarefa muito pequena e depois fazer uma pausa mais longa? Seja gentil com você hoje.",
        icon: "😴",
        shortMessage: "Reconhecido. Que tal uma pausa curta?" // Nova mensagem curta com emoji
    }
};

/**
 * Lida com a seleção do humor e exibe notificação.
 */
function handleMoodSelection(event) {
    let target = event.target.closest('.mood-option');
    if (!target) return;

    const selectedMood = target.dataset.mood;
    
    // 1. Atualizar a seleção visual:
    document.querySelectorAll('.mood-option').forEach(el => el.classList.remove('active'));
    target.classList.add('active'); 

    // 2. Obter a mensagem e o ícone
    const config = MOOD_MESSAGES[selectedMood];
    // Pegamos a shortMessage para a notificação
    const { icon, shortMessage } = config; 

    // 3. REMOVIDO: A linha 'moodFeedback.innerHTML = ...' foi removida.
    
    // 4. *** EXIBIR NOTIFICAÇÃO NA TELA *** (AGORA FUNCIONAL)
    showNotification(shortMessage, icon); 
}

/**
 * Configura o event listener para o Mood Tracker.
 */
function setupMoodTracker() {
    moodOptionsContainer.addEventListener('click', handleMoodSelection);
}