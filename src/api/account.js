import axios from 'axios';

// Hàm login
async function LoginApi(email, password) {
    try {
        const response = await axios.post('http://localhost:3050/login', {
            email: email,
            password: password
        });

        return response.data;
    } catch (error) {
        // Xử lý lỗi
        console.error('Error during login:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function GetAllUserApi() {
    try {
        const response = await axios.get('http://localhost:3050/all-user');

        return response.data;
    } catch (error) {
        // Xử lý lỗi
        console.error('Error during login:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export { 
    LoginApi,
    GetAllUserApi
};  
