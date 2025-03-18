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

async function SignupApi(name, email, password, cccd, phone, address, age, gender) {
    try {
        const response = await axios.post('http://localhost:3050/signup', {
            name: name,
            email: email,
            password: password,
            cccd: cccd,
            phone: phone,
            address: address,
            age: age,
            gender: gender
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

async function GetAUserApi(code) {
    try {
        const response = await axios.post('http://localhost:3050/get-user', { code });

        return response.data;
    } catch (error) {
        // Xử lý lỗi
        console.error('Error during login:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function UpdateUserStateApi(id, state) {
    try {
        const response = await axios.post("http://localhost:3050/limited", { id, state });
        return response.data;
    } catch (error) {
        console.error("Lỗi cập nhật trạng thái:", error);
        throw error;
    }
};

export { 
    SignupApi,
    LoginApi,
    ComfirmApi,
    GetAllUserApi,
    GetAUserApi,
    UpdateUserStateApi
};  
