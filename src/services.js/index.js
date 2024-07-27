import axios from "axios";

export const readFileFromApi = async (prompt) => {
    try {
        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCfOqWjRv3PD90jEmB7MFR9bxu7u6jlZZY',
            { contents: [{ parts: [{ text: prompt }] }] }
        );
        if (response.status === 200) {
            return response.data;
        } else {
            console.error('Failed to read file:', response.status);
        }
    } catch (error) {
        console.error('Error reading file from API:', error);
    }
};
