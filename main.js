
document.addEventListener('DOMContentLoaded', () => {
      console.log("FlowSpace script carregado.");
    
    });

document.addEventListener('DOMContentLoaded', function() {
    // 1. Script de Rolagem Suave
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. Animação Reveal on Scroll (Intersection Observer)
    const revealElements = document.querySelectorAll('.js-reveal');

    // Opções para o Observer: Aparecer quando 10% do elemento estiver visível
    const options = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% do elemento visível
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Se o elemento estiver interceptando (visível)
            if (entry.isIntersecting) {
                // Adiciona a classe que dispara a animação CSS
                entry.target.classList.add('is-revealed');
                // Para de observar o elemento, pois ele já foi revelado
                observer.unobserve(entry.target);
            }
        });
    }, options);

    // Começa a observar cada elemento com a classe js-reveal
    revealElements.forEach(element => {
        observer.observe(element);
    });
});