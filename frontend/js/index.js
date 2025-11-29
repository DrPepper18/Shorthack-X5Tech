// Данные сцен (будет заполняться с бэкенда)
const scenesData = {
    1: {
        image: "assets/scene1.jpg",
        type: "question",
        content: {
            question: "Какое у вас настроение сегодня?",
            answers: [
                { text: "Отличное! 😊", next: 2 },
                { text: "Нормальное 😐", next: 2 },
                { text: "Не очень 😔", next: 2 }
            ]
        }
    },
    2: {
        image: "assets/scene2.jpg", 
        type: "text",
        content: {
            title: "До дедлайна 3 секунды...",
            dialogue: "Ты слышишь тик часов? ДЕДЛАЙН УЖЕ БЛИЗКО",
            answers: [
                { text: "Я почти доделал, ещё 5 минут!", next: 3 }
            ]
        }
    },
    3: {
        image: "assets/scene3.jpg",
        type: "question", 
        content: {
            question: "Какой жанр фильмов вы предпочитаете?",
            answers: [
                { text: "Комедия", next: 4 },
                { text: "Драма", next: 4 },
                { text: "Фантастика", next: 4 }
            ]
        }
    },
    4: {
        image: "assets/scene4.jpg",
        type: "dark",
        content: {
            character: "Темная фигура: Ты слышишь тик часов?",
            urgent: "ДЕДЛАЙН УЖЕ БЛИЗКО",
            response: "Я почти доделал, ещё 5 минут!",
            answers: [
                { text: "[ Кто ты? ]", next: "stats" },
                { text: "[ Моя магия? ]", next: "stats" }
            ]
        }
    }
};

let currentSceneId = 1;
const userAnswers = [];

class DatabaseService {
    constructor() {
        this.userId = this.generateUserId();
        this.initializeUser();
    }

    generateUserId() {
        return Date.now();
    }

    async initializeUser() {
        console.log('Создан пользователь с ID:', this.userId);
    }

    async saveUserReply(sceneId, answerText, nextScene) {
        console.log(`Ответ: user_id=${this.userId}, scene_id=${sceneId}, answer="${answerText}", next=${nextScene}`);
        
        userAnswers.push({
            user_id: this.userId,
            scene_id: sceneId,
            answer: answerText,
            next_scene: nextScene,
            timestamp: new Date().toISOString()
        });
    }

    async getUserStats() {
        return {
            totalAnswers: userAnswers.length,
            scenesCompleted: [...new Set(userAnswers.map(a => a.scene_id))].length,
            firstAnswer: userAnswers[0],
            lastAnswer: userAnswers[userAnswers.length - 1]
        };
    }
}

const dbService = new DatabaseService();

// Инициализация сцены
function initializeScene(sceneId) {
    const sceneElement = document.getElementById(`scene${sceneId}`);
    if (!sceneElement) return;

    // Добавляем обработчики для ответов
    const answers = sceneElement.querySelectorAll('.answer, .dark-answer');
    answers.forEach(answer => {
        answer.addEventListener('click', function() {
            const nextScene = this.getAttribute('data-next');
            handleAnswer(sceneId, this.textContent, nextScene);
        });
    });
}

// Обработка ответа
function handleAnswer(sceneId, answerText, nextScene) {
    // Сохраняем ответ
    dbService.saveUserReply(sceneId, answerText, nextScene);
    
    // Анимация перехода
    const currentScene = document.getElementById(`scene${sceneId}`);
    currentScene.classList.remove('active');
    currentScene.classList.add('hidden');
    
    setTimeout(() => {
        if (nextScene === 'stats') {
            showStatsScreen();
        } else {
            const nextSceneId = parseInt(nextScene);
            const nextSceneElement = document.getElementById(`scene${nextSceneId}`);
            if (nextSceneElement) {
                nextSceneElement.classList.remove('hidden');
                nextSceneElement.classList.add('active');
                currentSceneId = nextSceneId;
            } else {
                showStatsScreen();
            }
        }
    }, 300);
}

// Показать статистику
function showStatsScreen() {
    document.querySelector('.mobile-frame').classList.add('hidden');
    const statsScreen = document.getElementById('statsScreen');
    statsScreen.classList.remove('hidden');
    statsScreen.classList.add('fade-in');
    
    dbService.getUserStats().then(stats => {
        console.log('Статистика:', stats);
    });
}

// Перезапуск квиза
function restartQuiz() {
    userAnswers.length = 0;
    currentSceneId = 1;
    
    document.getElementById('statsScreen').classList.add('hidden');
    document.querySelector('.mobile-frame').classList.remove('hidden');
    
    // Сбрасываем все сцены
    document.querySelectorAll('.scene-card').forEach(card => {
        card.classList.add('hidden');
        card.classList.remove('active');
    });
    
    // Показываем первую сцену
    document.getElementById('scene1').classList.remove('hidden');
    document.getElementById('scene1').classList.add('active');
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем все сцены
    for (let i = 1; i <= 4; i++) {
        initializeScene(i);
    }
    
    // Обработчик для кнопки перезапуска
    document.getElementById('restartButton').addEventListener('click', restartQuiz);
});