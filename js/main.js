// =========================================
// State
// =========================================
let currentLang = 'es';

// =========================================
// DOM Elements
// =========================================
const btnEs = document.getElementById('btn-es');
const btnEn = document.getElementById('btn-en');
const expContainer = document.getElementById('experience-container');
const eduContainer = document.getElementById('education-container');
const certContainer = document.getElementById('certifications-container');
const projContainer = document.getElementById('projects-container');

// =========================================
// Initialization
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    initLangToggle();
    renderContent();
    initScrollAnimations();
});

// =========================================
// Language Toggle
// =========================================
function initLangToggle() {
    btnEs.addEventListener('click', () => setLanguage('es'));
    btnEn.addEventListener('click', () => setLanguage('en'));
}

function setLanguage(lang) {
    if (currentLang === lang) return;
    currentLang = lang;

    // Update active button
    if (lang === 'es') {
        btnEs.classList.add('active');
        btnEn.classList.remove('active');
    } else {
        btnEn.classList.add('active');
        btnEs.classList.remove('active');
    }

    // Update static strings
    updateStaticStrings();

    // Re-render dynamic content
    renderContent();

    // Re-trigger scroll animations for newly rendered elements
    setTimeout(initScrollAnimations, 100);
}

function updateStaticStrings() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (uiStrings[currentLang][key]) {
            el.innerHTML = uiStrings[currentLang][key];
        }
    });
}

// =========================================
// Rendering Builders
// =========================================
function renderContent() {
    const data = portfolioData[currentLang];

    // Render Experience
    expContainer.innerHTML = data.experience.map(item => `
        <div class="timeline-item fade-in ${item.imageRight ? 'has-right-image' : ''}">
            <div class="timeline-content">
                <h3 class="role">${item.role}</h3>
                <div class="company">${item.company}</div>
                <div class="period">${item.period}</div>
                ${Array.isArray(item.description) ? `<ul class="description-list">${item.description.map(d => `<li>${d}</li>`).join('')}</ul>` : `<p class="description">${item.description}</p>`}
                ${item.embed ? `<div class="credential-embed">${item.embed}</div>` : ''}
            </div>
            ${item.imageRight ? `
            <div class="timeline-image-right">
                <img src="${item.imageRight}" alt="${item.company || item.role} image">
            </div>
            ` : ''}
        </div>
    `).join('');

    // Render Education
    eduContainer.innerHTML = data.education.map(item => `
        <div class="timeline-item fade-in ${item.imageRight ? 'has-right-image' : ''}">
            <div class="timeline-content">
                <h3 class="role">${item.role}</h3>
                <div class="company">${item.company}</div>
                <div class="period">${item.period}</div>
                ${Array.isArray(item.description) ? `<ul class="description-list">${item.description.map(d => `<li>${d}</li>`).join('')}</ul>` : `<p class="description">${item.description}</p>`}
                ${item.embed ? `<div class="credential-embed">${item.embed}</div>` : ''}
            </div>
            ${item.imageRight ? `
            <div class="timeline-image-right">
                <img src="${item.imageRight}" alt="${item.company || item.role} image">
            </div>
            ` : ''}
        </div>
    `).join('');

    // Render Certifications
    if (data.certifications && certContainer) {
        certContainer.innerHTML = data.certifications.map(item => `
            <div class="timeline-item fade-in ${item.imageRight ? 'has-right-image' : ''}">
                <div class="timeline-content">
                    <h3 class="role">${item.role}</h3>
                    <div class="company">${item.company}</div>
                    <div class="period">${item.period}</div>
                    ${Array.isArray(item.description) ? `<ul class="description-list">${item.description.map(d => `<li>${d}</li>`).join('')}</ul>` : `<p class="description">${item.description}</p>`}
                    ${item.embed ? `<div class="credential-embed">${item.embed}</div>` : ''}
                </div>
                ${item.imageRight ? `
                <div class="timeline-image-right">
                    <img src="${item.imageRight}" alt="${item.company || item.role} image">
                </div>
                ` : ''}
            </div>
        `).join('');
    }

    // Render Projects
    projContainer.innerHTML = data.projects.map(item => `
        <div class="project-card fade-in">
            <h3 class="project-title">${item.title}</h3>
            <div class="project-desc">${item.description}</div>
            ${renderCarousel(item.media)}
            <div class="tags">
                ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            ${item.link ? `
            <div class="links">
                <a href="${item.link}" target="_blank" rel="noopener noreferrer">
                    Ver Proyecto
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                </a>
            </div>` : ''}
        </div>
    `).join('');

    // Reload twitter widgets for dynamically added blockquotes
    if (window.twttr && window.twttr.widgets) {
        window.twttr.widgets.load(projContainer);
    }

    // Initialize carousels newly added to DOM
    setTimeout(initCarousels, 100);
}

function renderCarousel(mediaArray) {
    if (!mediaArray || mediaArray.length === 0) return '';
    const itemsHtml = mediaArray.map(item => {
        if (item.type === 'video') {
            return `<div class="carousel-item"><video autoplay loop muted playsinline src="${item.src}" class="carousel-media"></video></div>`;
        } else {
            return `<div class="carousel-item"><img src="${item.src}" alt="media" class="carousel-media"></div>`;
        }
    }).join('');

    return `
    <div class="project-carousel">
        <button class="carousel-arrow left" aria-label="Previous">&lsaquo;</button>
        <div class="carousel-track">
            ${itemsHtml}
        </div>
        <button class="carousel-arrow right" aria-label="Next">&rsaquo;</button>
    </div>
    `;
}

function initCarousels() {
    const carousels = document.querySelectorAll('.project-carousel');
    carousels.forEach(carousel => {
        // Prevent adding multiple event listeners if already initialized
        if (carousel.dataset.initialized) return;
        carousel.dataset.initialized = "true";

        const track = carousel.querySelector('.carousel-track');
        const leftBtn = carousel.querySelector('.carousel-arrow.left');
        const rightBtn = carousel.querySelector('.carousel-arrow.right');
        
        if (leftBtn && track) {
            leftBtn.addEventListener('click', () => {
                track.scrollBy({ left: -300, behavior: 'smooth' });
            });
        }
        
        if (rightBtn && track) {
            rightBtn.addEventListener('click', () => {
                track.scrollBy({ left: 300, behavior: 'smooth' });
            });
        }
    });
}

// =========================================
// Scroll Animations (Intersection Observer)
// =========================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once it has faded in
                // obs.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
}

// =========================================
// Image Modal (Lightbox)
// =========================================
function initImageModal() {
    const modal = document.getElementById("image-modal");
    if (!modal) return;

    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.getElementsByClassName("close-modal")[0];

    // Delegate event listener to the container so dynamically created images work
    document.body.addEventListener('click', function(e) {
        if (e.target && e.target.closest('.timeline-image-right img')) {
            modal.style.display = "flex";
            // Trigger reflow for transition
            modal.offsetHeight; 
            modal.classList.add("show");
            modalImg.src = e.target.src;
        }
    });

    closeBtn.onclick = function() {
        closeModal();
    }

    modal.onclick = function(e) {
        if (e.target !== modalImg) {
            closeModal();
        }
    }

    function closeModal() {
        modal.classList.remove("show");
        setTimeout(() => {
            modal.style.display = "none";
            modalImg.src = "";
        }, 300); // match transition time
    }
}

// Ensure the modal initialized once after load
document.addEventListener('DOMContentLoaded', initImageModal);
