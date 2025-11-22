document.addEventListener('DOMContentLoaded', function() {
    // Referências aos elementos principais
    const filterButtons = document.querySelectorAll('.filter-btn');
    const resourceCards = document.querySelectorAll('.card');
    const resourceGrid = document.querySelector('.resource-grid');
    const detailView = document.getElementById('detail-view');
    const detailContent = document.getElementById('detail-content');
    const backButton = document.getElementById('back-to-grid');
    const hiddenContentContainer = document.getElementById('hidden-content');


    // ---------------------------------------------
    // FUNÇÕES DE EXIBIÇÃO (Carrossel/Slide)
    // ---------------------------------------------

    function renderDetail(targetId) {
        // 1. Encontra o conteúdo oculto pelo ID (ex: #details-passeios)
        const hiddenContent = hiddenContentContainer.querySelector(`#${targetId}`);
        
        if (!hiddenContent) return;

        // 2. Copia o conteúdo HTML do bloco oculto e injeta na área visível
        detailContent.innerHTML = hiddenContent.innerHTML;


        // 3. Cria e adciona o botão de navegação
        const controlsHTML = `
            <div class="carousel-navigation">
                <button class="nav-arrow" id="nav-prev"><i class="fas fa-chevron-left"></i></button>
                <button class="nav-arrow" id="nav-next"><i class="fas fa-chevron-right"></i></button>
            </div>
        `;
        
        // Adiciona os controles abaixo do conteúdo injetado
        detailContent.insertAdjacentHTML('afterend', controlsHTML);
        
        
        // 4. Configura a lógica do scroll
        const carouselWrapper = detailContent.querySelector('.carousel-wrapper');
        const nextButton = document.getElementById('nav-next');
        const prevButton = document.getElementById('nav-prev');

        if (carouselWrapper && nextButton && prevButton) {
            
            // P/ o montante de rolagem ser do tamanho da primeira página (slide)
            const scrollAmount = carouselWrapper.querySelector('.carousel-page').offsetWidth + 20; // + gap de 20px
            
            nextButton.addEventListener('click', () => {
                carouselWrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });

            prevButton.addEventListener('click', () => {
                carouselWrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
        }
        
        // 5. Esconde a grade principal e mostra a seção de detalhes
        resourceGrid.classList.add('hidden');
        detailView.classList.remove('hidden');
        window.scrollTo(0, 0); 
    }

    function backToGrid() {
        // Limpa os controles de navegação antes de voltar
        const navControls = document.querySelector('.carousel-navigation');
        if (navControls) navControls.remove();
        
        detailView.classList.add('hidden');
        resourceGrid.classList.remove('hidden');
    }

    // ---------------------------------------------
    // LISTENERS (Eventos)
    // ---------------------------------------------

    // 1. Evento de Filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const activeFilter = this.getAttribute('data-filter');
            
            resourceCards.forEach(card => {
                const tags = card.getAttribute('data-tags');
                if (activeFilter === 'all' || tags.includes(activeFilter)) {
                    card.classList.remove('hidden'); 
                } else {
                    card.classList.add('hidden'); 
                }
            });
        });
    });

    // 2. Evento de Clique no Cartão (Gatilho Carrossel)
    resourceCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault(); 
            const targetId = this.getAttribute('data-target');
            
            if (targetId) {
                renderDetail(targetId);
            }
        });
    });

    // 3. Evento do Botão Voltar
    backButton.addEventListener('click', function(e) {
        e.preventDefault(); 
        backToGrid();
    });
});