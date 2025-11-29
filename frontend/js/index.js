// Объединенный файл без ES6 модулей для работы через file://

// API клиент (axios будет загружен через CDN)
const apiClient = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Функция отправки запроса
async function sendUserReply(userId = null, lineId = null, optionId = null, lineIdRequested = null) {
    try {
        const requestData = {
            user_id: userId,
            line_id: lineId,
            option_id: optionId,
            line_id_requested: lineIdRequested
        };
        
        console.log('Отправка запроса:', requestData);
        
        const response = await apiClient.post('/scriptline', requestData);
        
        return response.data;
    } catch (error) {
        console.error('Ошибка при отправке ответа:', error);
        throw error;
    }
}

let currentSceneId = null;
let currentLineId = null;
let userId = 0; // Начинаем с user_id = 0
let sceneCounter = 0;
let userAnswers = []; // Массив для хранения выбранных ответов
let currentQuestion = null; // Текущий вопрос

class DatabaseService {
    constructor() {
        this.userId = userId;
    }

    async loadScene(lineIdRequested = null, optionId = null, lineId = null) {
        try {
            const response = await sendUserReply(
                this.userId,
                lineId,
                optionId,
                lineIdRequested
            );
            
            console.log('Получен ответ от сервера:', response);
            
            return {
                scriptline: response.scriptline,
                options: response.options,
                line_id: response.line_id
            };
        } catch (error) {
            console.error('Ошибка при загрузке сцены:', error);
            if (error.response) {
                console.error('Данные ответа:', error.response.data);
                console.error('Статус:', error.response.status);
            }
            throw error;
        }
    }
}

const dbService = new DatabaseService();

// Создание HTML сцены
function createSceneHTML(sceneData, lineId) {
    sceneCounter++;
    const sceneId = `scene-${sceneCounter}`;
    
    const sceneCard = document.createElement('div');
    sceneCard.className = 'scene-card';
    sceneCard.id = sceneId;
    sceneCard.dataset.sceneId = sceneId;
    sceneCard.dataset.lineId = lineId;
    
    // Базовое изображение - используем существующие файлы
    const imageFiles = ['Сцена 1.png', 'Сцена 2.png', 'Сцена 1.png', 'Сцена 4.png'];
    const imageSrc = `assets/${imageFiles[(sceneCounter - 1) % imageFiles.length]}`;
    
    sceneCard.innerHTML = `
        <img src="${imageSrc}" alt="Сцена" class="scene-image">
        <div class="scene-content">
            <div class="question">${sceneData.scriptline || ''}</div>
            <div class="answers">
                ${sceneData.options.map((option, index) => {
                    const [optionId, optionText, leadsTo] = option;
                    return `<div class="answer" data-option-id="${optionId}" data-line-id="${lineId}">${optionText}</div>`;
                }).join('')}
            </div>
        </div>
    `;
    
    return sceneCard;
}

// Показать сцену
function showScene(sceneData, lineId) {
    // Скрываем все текущие сцены
    document.querySelectorAll('.scene-card').forEach(card => {
        card.classList.remove('active');
        card.classList.add('hidden');
    });
    
    // Сохраняем текущий вопрос
    currentQuestion = sceneData.scriptline;
    
    // Создаем новую сцену
    const sceneCard = createSceneHTML(sceneData, lineId);
    const mobileFrame = document.querySelector('.mobile-frame');
    mobileFrame.appendChild(sceneCard);
    
    // Показываем новую сцену
    setTimeout(() => {
        sceneCard.classList.remove('hidden');
        sceneCard.classList.add('active');
    }, 50);
    
    // Сохраняем currentLineId перед добавлением обработчиков
    currentLineId = lineId;
    
    // Добавляем обработчики для ответов
    const answers = sceneCard.querySelectorAll('.answer');
    answers.forEach(answer => {
        answer.addEventListener('click', function() {
            const optionId = parseInt(this.dataset.optionId);
            const optionText = this.textContent.trim();
            // Используем currentLineId вместо dataset.lineId
            handleAnswer(currentLineId, optionId, optionText);
        });
    });
}

// Обработка ответа
async function handleAnswer(lineId, optionId, optionText) {
    try {
        // Анимация перехода
        const currentScene = document.querySelector('.scene-card.active');
        if (currentScene) {
            currentScene.classList.remove('active');
            currentScene.classList.add('hidden');
        }
        
        // Загружаем следующую сцену
        const nextSceneData = await dbService.loadScene(null, optionId, lineId);
        
        // Сохраняем ответ с scriptline (текстом следующей сцены) вместо выбранного варианта
        if (currentQuestion && nextSceneData.scriptline) {
            userAnswers.push({
                question: currentQuestion,
                answer: nextSceneData.scriptline
            });
        }
        
        // Если нет вариантов ответа, показываем статистику
        if (!nextSceneData.options || nextSceneData.options.length === 0) {
            setTimeout(() => {
                showStatsScreen();
            }, 300);
            return;
        }
        
        // Используем line_id из ответа бэкенда
        const nextLineId = nextSceneData.line_id;
        
        setTimeout(() => {
            showScene(nextSceneData, nextLineId);
        }, 300);
        
    } catch (error) {
        console.error('Ошибка при обработке ответа:', error);
        // В случае ошибки показываем статистику
        setTimeout(() => {
            showStatsScreen();
        }, 300);
    }
}

// Показать статистику
function showStatsScreen() {
    document.querySelector('.mobile-frame').classList.add('hidden');
    const statsScreen = document.getElementById('statsScreen');
    statsScreen.classList.remove('hidden');
    statsScreen.classList.add('fade-in');
    
    // Отображаем выбранные ответы
    const answersContainer = document.getElementById('answersList');
    if (answersContainer) {
        if (userAnswers.length > 0) {
            answersContainer.innerHTML = userAnswers.map((item, index) => `
                <div class="answer-item">
                    <div class="answer-question"><strong>${index + 1}. ${item.question}</strong></div>
                    <div class="answer-text">${item.answer}</div>
                </div>
            `).join('');
        } else {
            answersContainer.innerHTML = '<p>Ответы не найдены</p>';
        }
    }
}

// Перезапуск квиза
function restartQuiz() {
    sceneCounter = 0;
    currentSceneId = null;
    currentLineId = null;
    userAnswers = []; // Очищаем массив ответов
    currentQuestion = null;
    
    // Очищаем все сцены
    const mobileFrame = document.querySelector('.mobile-frame');
    mobileFrame.querySelectorAll('.scene-card').forEach(card => card.remove());
    
    document.getElementById('statsScreen').classList.add('hidden');
    document.querySelector('.mobile-frame').classList.remove('hidden');
    
    // Загружаем первую сцену
    loadFirstScene();
}

// Загрузка первой сцены
async function loadFirstScene() {
    try {
        // Первый запрос: user_id=0, line_id=null, option_id=null, line_id_requested=1
        const firstSceneData = await dbService.loadScene(1, null, null);
        if (firstSceneData && firstSceneData.line_id) {
            showScene(firstSceneData, firstSceneData.line_id);
        } else {
            console.error('Не удалось получить данные сцены');
            alert('Ошибка при загрузке сцены. Проверьте подключение к серверу.');
        }
    } catch (error) {
        console.error('Ошибка при загрузке первой сцены:', error);
        alert('Ошибка при загрузке сцены. Проверьте подключение к серверу.');
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик для кнопки перезапуска
    const restartButton = document.getElementById('restartButton');
    if (restartButton) {
        restartButton.addEventListener('click', restartQuiz);
    }
    
    // Загружаем первую сцену
    loadFirstScene();
});
