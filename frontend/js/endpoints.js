import { apiClient } from "./api";

export async function sendUserReply(userId = null, lineId = null, optionId = null, lineIdRequested = null) {
    try {
        const requestData = {
            user_id: userId,
            line_id: lineId,                    // Какую строку сохраняем в историю
            option_id: optionId,                // Какой вариант выбрали (если null, то не сохраняем в историю)
            line_id_requested: lineIdRequested  // Какую строку хотим получить (если null, то не получаем)
        };
        
        console.log('Отправка запроса:', requestData);
        
        const response = await apiClient.post('/scriptline', requestData);
        
        return response.data;
    } catch (error) {
        console.error('Ошибка при отправке ответа:', error);
        throw error;
    }
}