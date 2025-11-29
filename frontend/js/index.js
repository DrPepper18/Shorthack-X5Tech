// Данные вопросов и ответов (в реальном приложении будут загружаться с сервера)
const questions = [
    {
        id: 1,
        question: "Какой ваш любимый цвет?",
        answers: [
            { id: 1, text: "Красный", leads_to: 2 },
            { id: 2, text: "Синий", leads_to: 2 },
            { id: 3, text: "Зеленый", leads_to: 2 }
        ]
    },
    {
        id: 2,
        question: "Какое ваше любимое время года?",
        answers: [
            { id: 4, text: "Весна", leads_to: 3 },
            { id: 5, text: "Лето", leads_to: 3 },
            { id: 6, text: "Зима", leads_to: 3 }
        ]
    },
    {
        id: 3,
        question: "Какой жанр фильмов вы предпочитаете?",
        answers: [
            { id: 7, text: "Комедия", leads_to: null },
            { id: 8, text: "Драма", leads_to: null },
            { id: 9, text: "Фантастика", leads_to: null }
        ]
    }
];

// Хранилище ответов пользователя
const userAnswers = [];
let currentQuestionIndex = 0;

const questionElement = document.getElementById('question');
const answersContainer = document.getElementById('answers');
const character = document.getElementById('character');
const mainContainer = document.getElementById('mainContainer');
const statsScreen = document.getElementById('statsScreen');
const restartButton = document.getElementById('restartButton');

// Имитация работы с базой данных
class DatabaseService {
    constructor() {
        this.userId = this.generateUserId();
        this.initializeUser();
    }

    generateUserId() {
        return Date.now(); // Простая имитация ID пользователя
    }

    async initializeUser() {
        // Имитация создания пользователя в базе
        console.log('Создан пользователь с ID:', this.userId);
        // В реальном приложении здесь был бы запрос: INSERT INTO users (id, is_admin) VALUES (${this.userId}, false)
    }

    async saveUserReply(questionId, optionId) {
        // Имитация сохранения ответа в базу
        console.log(`Сохранение ответа: user_id=${this.userId}, question_id=${questionId}, option_id=${optionId}`);
        
        // В реальном приложении здесь был бы запрос:
        // INSERT INTO user_reply (user_id, option_id) VALUES (${this.userId}, ${optionId})
        
        userAnswers.push({
            user_id: this.userId,
            question_id: questionId,
            option_id: optionId,
            timestamp: new Date().toISOString()
        });
    }

    async getUserStats() {
        // Имитация получения статистики
        return {
            totalAnswers: userAnswers.length,
            firstAnswer: userAnswers[0],
            lastAnswer: userAnswers[userAnswers.length - 1]
        };
    }
}

const dbService = new DatabaseService();

function showQuestion(index) {
    const q = questions[index];
    questionElement.textContent = q.question;
    
    // Очищаем и создаем новые варианты ответов
    answersContainer.innerHTML = '';
    q.answers.forEach((answer) => {
        const answerElement = document.createElement('div');
        answerElement.className = 'answer';
        answerElement.textContent = answer.text;
        answerElement.dataset.answerId = answer.id;
        answerElement.dataset.leadsTo = answer.leads_to;
        answerElement.addEventListener('click', handleAnswerClick);
        answersContainer.appendChild(answerElement);
    });

    // Сбрасываем стили для анимации появления
    questionElement.style.opacity = '1';
    answersContainer.style.opacity = '1';
    character.style.opacity = '1';
    
    // Сбрасываем позицию персонажа
    character.style.transform = 'translateX(0)';
}

function handleAnswerClick(event) {
    const selectedAnswer = event.currentTarget;
    const answerId = parseInt(selectedAnswer.dataset.answerId);
    const leadsTo = selectedAnswer.dataset.leadsTo ? parseInt(selectedAnswer.dataset.leadsTo) : null;
    
    // Сохраняем ответ в базу
    const currentQuestion = questions[currentQuestionIndex];
    dbService.saveUserReply(currentQuestion.id, answerId);

    // Визуальное выделение выбранного ответа
    selectedAnswer.style.background = '#e3f2fd';
    selectedAnswer.style.borderColor = '#2196f3';

    // Блокируем дальнейшие клики
    const allAnswers = document.querySelectorAll('.answer');
    allAnswers.forEach(answer => {
        answer.style.pointerEvents = 'none';
    });

    // Анимация ухода персонажа вправо (ИЗМЕНЕНО)
    character.classList.add('slide-out-right');
    
    // Анимация исчезновения вопроса
    questionElement.style.opacity = '0';
    
    // Анимация падения ответов вниз
    allAnswers.forEach(answer => {
        answer.classList.add('fall-down');
    });

    // Определяем следующий вопрос
    setTimeout(() => {
        if (leadsTo !== null) {
            // Переход к следующему вопросу
            const nextQuestionIndex = questions.findIndex(q => q.id === leadsTo);
            if (nextQuestionIndex !== -1) {
                currentQuestionIndex = nextQuestionIndex;
                showQuestion(currentQuestionIndex);
                
                // Анимация появления нового контента
                character.classList.remove('slide-out-right');
                character.classList.add('slide-in-right');
                
                setTimeout(() => {
                    character.classList.remove('slide-in-right');
                }, 500);
            }
        } else {
            // Это был последний вопрос - показываем статистику
            showStatsScreen();
        }
    }, 1000);
}

function showStatsScreen() {
    // Скрываем основной контейнер
    mainContainer.classList.add('hidden');
    
    // Показываем экран статистики
    statsScreen.classList.remove('hidden');
    statsScreen.classList.add('fade-in');
    
    // Меняем фон страницы
    document.body.style.backgroundColor = '#2c3e50';
    
    // Загружаем статистику
    dbService.getUserStats().then(stats => {
        console.log('Статистика пользователя:', stats);
        // Здесь можно обновить UI с реальной статистикой
    });
}

function restartQuiz() {
    // Сбрасываем состояние
    userAnswers.length = 0;
    currentQuestionIndex = 0;
    
    // Скрываем статистику
    statsScreen.classList.add('hidden');
    statsScreen.classList.remove('fade-in');
    
    // Показываем основной контейнер
    mainContainer.classList.remove('hidden');
    
    // Восстанавливаем фон
    document.body.style.backgroundColor = '#f0f0f0';
    
    // Показываем первый вопрос
    showQuestion(currentQuestionIndex);
    
    // Сбрасываем анимации персонажа
    character.classList.remove('slide-out-right', 'slide-in-right');
    character.style.opacity = '1';
    character.style.transform = 'translateX(0)';
}

// Обработчики событий
restartButton.addEventListener('click', restartQuiz);
restartButton.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-3px)';
});
restartButton.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
});

// Инициализация первого вопроса
showQuestion(currentQuestionIndex);












