import { apiClient } from "./api";
async function sendUserReply(userId, optionId) {
    try {
        const response = await axios.post('/scriptline', {
            user_id: userId,
            option_id: optionId
        });
        
        return response.data;
    } catch (error) {
        console.error('Ошибка при отправке ответа:', error);
        throw error;
    }
}