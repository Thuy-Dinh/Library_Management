import axios from 'axios';

async function ComfirmApi() {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post("http://localhost:3050/comfirm", {
            token: token
        });

        return response.data;
    } catch (error) {
        // Xử lý lỗi
        console.error('Error during login:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function SignupApi(name, email, password) {
    try {
        const response = await axios.post('http://localhost:3050/signup', {
            name: name,
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

async function GetAUserApi(id) {
    try {
        const response = await axios.post('http://localhost:3050/get-user', { id });

        return response.data;
    } catch (error) {
        // Xử lý lỗi
        console.error('Error during login:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export { 
    SignupApi,
    LoginApi,
    ComfirmApi,
    GetAllUserApi,
    GetAUserApi
};  
