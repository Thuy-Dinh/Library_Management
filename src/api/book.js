import axios from 'axios';

// Hàm lấy dữ liệu yêu thích
async function FavoriteApi() {
    try {
        const response = await axios.get('http://localhost:3050/book/favorite-book');

        return response.data;  // Trả về dữ liệu yêu thích
    } catch (error) {
        // Xử lý lỗi
        console.error('Error fetching favorite books:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function LastestBookApi() {
    try {
        const response = await axios.get('http://localhost:3050/book/lastest-book');

        return response.data;  // Trả về dữ liệu yêu thích
    } catch (error) {
        // Xử lý lỗi
        console.error('Error fetching lastest books:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function BookDetailApi(id) {
    try {
        const response = await axios.get(`http://localhost:3050/book/book-detail/${id}`);

        return response.data;  
    } catch (error) {
        // Xử lý lỗi
        console.error('Error fetching book-detail:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function BookProposesApi(id) {
    try {
        const response = await axios.get(`http://localhost:3050/book/book-proposes/${id}`);

        return response.data;  
    } catch (error) {
        // Xử lý lỗi
        console.error('Error fetching book-proposes:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function GetAllBookApi() {
    try {
        const response = await axios.get('http://localhost:3050/book/all-book');

        return response.data;
    } catch (error) {
        // Xử lý lỗi
        console.error('Error during login:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export { 
    FavoriteApi, 
    LastestBookApi, 
    BookDetailApi, 
    BookProposesApi,
    GetAllBookApi
};  
