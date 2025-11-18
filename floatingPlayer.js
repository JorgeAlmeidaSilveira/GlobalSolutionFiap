// Espera a página carregar
document.addEventListener("DOMContentLoaded", () => {
    const musicWidget = document.getElementById("music-widget");
    const minimizeBtn = document.getElementById("minimize-widget-btn");
    const minimizeIcon = minimizeBtn.querySelector("i");

    // Controles
    const playPauseBtn = document.getElementById("play-pause-btn");
    const playPauseIcon = playPauseBtn.querySelector("i");

    // Display
    const trackTitle = document.getElementById("track-title");
    const trackArtist = document.getElementById("track-artist");
    const trackThumbnailIcon = document.querySelector(".track-thumbnail i");

    // Listas
    const presetBtns = document.querySelectorAll(".preset-btn");
    const customForm = document.getElementById("custom-music-form");
    const customInput = document.getElementById("youtube-link-input");

    // (Opcional) Mostra o widget ao carregar
    //musicWidget.style.display = "block";

    // --- Minimizar o Widget ---
    minimizeBtn.addEventListener("click", () => {
       if (minimizeIcon.classList.contains("fa-angle-down")) {
            // Adiciona um efeito de "sumir"
            musicWidget.style.height = "3rem";
            musicWidget.style.transform = "translateY(20px)";
            minimizeIcon.classList.remove("fa-angle-down");
            minimizeIcon.classList.add("fa-angle-up");
       } else {
            // Restaura o widget
            musicWidget.style.height = "auto";
            musicWidget.style.transform = "translateY(0)";
            minimizeIcon.classList.remove("fa-angle-up");
            minimizeIcon.classList.add("fa-angle-down");
       }
    });

    // --- Botão de Play/Pause ---
    playPauseBtn.addEventListener("click", () => {
        // Verifica se está tocando (pelo ícone de pause)
        const isPlaying = playPauseIcon.classList.contains("fa-pause");

        if (isPlaying) {
            // Pausa
            playPauseIcon.classList.remove("fa-pause");
            playPauseIcon.classList.add("fa-play");
            playPauseBtn.title = "Tocar";
        } else {
            // Toca
            playPauseIcon.classList.remove("fa-play");
            playPauseIcon.classList.add("fa-pause");
            playPauseBtn.title = "Pausar";
        }
        // Aqui iria a lógica real de áudio (Tone.js, etc.)
        console.log("Play/Pause simulado.");
    });

    // --- Trocar para Músicas Padrão ---
    presetBtns.forEach(button => {
        button.addEventListener("click", () => {
            const title = button.getAttribute("data-track-title");
            const icon = button.querySelector("i").className;

            // Atualiza o player
            trackTitle.textContent = title;
            trackArtist.textContent = "Ambiente";
            trackThumbnailIcon.className = icon;

            // Simula que começou a tocar
            playPauseIcon.classList.remove("fa-play");
            playPauseIcon.classList.add("fa-pause");
            playPauseBtn.title = "Pausar";

            console.log("Simulando tocar:", title);
        });
    });

    // --- Tocar Link Customizado ---
    customForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Impede o formulário de recarregar a página
        const link = customInput.value;

        if (link.trim() === "") return; // Ignora se estiver vazio

        // Simulação simples de "tocar" o link
        if (link.toLowerCase().includes("youtube") || link.toLowerCase().includes("youtu.be")) {
            trackTitle.textContent = "Música do YouTube";
            trackArtist.textContent = "Link Customizado";
            trackThumbnailIcon.className = "fa-brands fa-youtube"; // Muda ícone

            customInput.value = ""; // Limpa o campo

            playPauseIcon.classList.remove("fa-play");
            playPauseIcon.classList.add("fa-pause");

            console.log("Simulando tocar link:", link);
        } else {
            alert("Link inválido. Por favor, cole um link do YouTube.");
        }
    });

});