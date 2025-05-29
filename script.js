// Здесь можно добавить интерактив для портфолио 

// Кнопка "Скопировать email"
const copyBtn = document.getElementById('copy-email');
const emailLink = document.getElementById('email-link');
const copyStatus = document.getElementById('copy-status');

if (copyBtn && emailLink && copyStatus) {
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(emailLink.textContent.trim()).then(() => {
            copyStatus.style.display = 'inline';
            setTimeout(() => {
                copyStatus.style.display = 'none';
            }, 1500);
        });
    });
}

// Кнопка смены темы
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function setTheme(dark) {
    if (dark) {
        document.body.classList.add('dark');
        themeToggle.textContent = '☀️';
        themeToggle.title = 'Сменить на светлую тему';
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark');
        themeToggle.textContent = '🌙';
        themeToggle.title = 'Сменить на тёмную тему';
        localStorage.setItem('theme', 'light');
    }
}

if (themeToggle) {
    // Инициализация темы
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (savedTheme === null && prefersDark)) {
        setTheme(true);
    } else {
        setTheme(false);
    }
    themeToggle.addEventListener('click', () => {
        setTheme(!document.body.classList.contains('dark'));
    });
}

// Fade-in анимация секций при прокрутке
function handleFadeIn() {
    const fadeEls = document.querySelectorAll('.fade-in');
    const trigger = window.innerHeight * 0.95;
    fadeEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < trigger) {
            el.classList.add('visible');
        }
    });
}
window.addEventListener('scroll', handleFadeIn);
window.addEventListener('DOMContentLoaded', handleFadeIn);
window.addEventListener('resize', handleFadeIn);

// Кнопка "Наверх"
const toTopBtn = document.getElementById('to-top');
if (toTopBtn) {
    // Плавная прокрутка наверх
    toTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    // Показ/скрытие кнопки при скролле
    function handleToTopBtn() {
        if (window.scrollY > 300) {
            toTopBtn.style.display = 'block';
        } else {
            toTopBtn.style.display = 'none';
        }
    }
    window.addEventListener('scroll', handleToTopBtn);
    window.addEventListener('DOMContentLoaded', handleToTopBtn);
}

// Плавная прокрутка по якорям
const navLinks = document.querySelectorAll('nav a[href^="#"]');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Кнопка "Скачать PDF"
const pdfBtn = document.getElementById('download-pdf');
if (pdfBtn) {
    pdfBtn.addEventListener('click', () => {
        const pdfContent = document.getElementById('pdf-content');
        const avatarImg = document.getElementById('avatar-img');
        // Временно скрываем аватар
        let prevDisplay = null;
        if (avatarImg) {
            prevDisplay = avatarImg.style.display;
            avatarImg.style.display = 'none';
        }
        pdfBtn.disabled = true;
        pdfBtn.textContent = 'Готовим PDF...';
        html2canvas(pdfContent, { scale: 1 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new window.jspdf.jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('portfolio-karavaev.pdf');
            pdfBtn.disabled = false;
            pdfBtn.textContent = 'Скачать PDF';
            // Возвращаем аватар
            if (avatarImg) avatarImg.style.display = prevDisplay || '';
        }).catch(() => {
            pdfBtn.disabled = false;
            pdfBtn.textContent = 'Скачать PDF';
            // Возвращаем аватар
            if (avatarImg) avatarImg.style.display = prevDisplay || '';
            alert('Ошибка при создании PDF. Попробуйте ещё раз.');
        });
    });
} 