document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    let currentCardIndex = 0;
    
    // Добавляем индикатор прогресса
    const progressIndicator = document.createElement('div');
    progressIndicator.className = 'progress-indicator';
    
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `progress-dot ${index === 0 ? 'active' : ''}`;
        progressIndicator.appendChild(dot);
    });
    
    document.querySelector('.cards-container').appendChild(progressIndicator);
    const progressDots = document.querySelectorAll('.progress-dot');
    
    // Функция для переключения карточек
    function switchCard(direction) {
        // Убираем активный класс с текущей карточки
        cards[currentCardIndex].classList.remove('active');
        progressDots[currentCardIndex].classList.remove('active');
        
        // Определяем индекс следующей карточки
        if (direction === 'next') {
            currentCardIndex = (currentCardIndex + 1) % cards.length;
        } else {
            currentCardIndex = (currentCardIndex - 1 + cards.length) % cards.length;
        }
        
        // Добавляем активный класс к новой карточке
        cards[currentCardIndex].classList.add('active');
        progressDots[currentCardIndex].classList.add('active');
    }
    
    // Обработчик клика по карточкам
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Проверяем, не был ли клик по кнопке варианта ответа
            if (!e.target.classList.contains('option-btn')) {
                switchCard('next');
            }
        });
    });
    
    // Обработчики для кнопок вариантов ответа
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Убираем alert и просто переходим к следующей карточке
            switchCard('next');
        });
    });
    
    // Обработчик клавиатуры для навигации
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            switchCard('next');
        } else if (e.key === 'ArrowLeft') {
            switchCard('prev');
        }
    });
});