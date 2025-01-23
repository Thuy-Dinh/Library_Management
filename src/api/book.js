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

async function CreateBookApi(title, author, topic, subcategory, tag, publisher, publication_year, edition, summary, language, cover) {
    try {
        console.log(title, author, topic, subcategory, tag, publisher, publication_year, edition, summary, language, cover);
        const response = await axios.post('http://localhost:3050/book/create-book', {
            title, 
            author, 
            topic, 
            subcategory, 
            tag, 
            publisher, 
            publication_year, 
            edition, 
            summary, 
            language, 
            cover
        });

        return response.data; // Trả về dữ liệu phản hồi từ API
    } catch (error) {
        console.error('Error during creating book:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function UpdateBookApi(id, formData) {
    try {
        const response = await axios.post(
            `http://localhost:3050/book/update-book/${id}`,
            formData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );        

        return response.data;
    } catch (error) {
        console.error("Error during updating book:", error.response ? error.response.data : error.message);
        throw error;
    }
}

async function DeleteBookApi(bookID) {
    try {
        const response = await axios.get(`http://localhost:3050/book/delete-book/${bookID}`);

        return response.data;  
    } catch (error) {
        console.error('Error during delete book:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function GetAllTopicApi() {
    try {
        const response = await axios.get('http://localhost:3050/book/all-topic');

        return response.data;
    } catch (error) {
        // Xử lý lỗi
        console.error('Error during login:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function CreateTopicApi(topic) {
    try {
        const response = await axios.post('http://localhost:3050/book/create-topic', {
            topic
        });

        return response.data; // Trả về dữ liệu phản hồi từ API
    } catch (error) {
        console.error('Error during creating book:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function SearchByCategoryApi(topics) {
    try {
        const response = await axios.get(`http://localhost:3050/book/topic-books`, {
            params: { topics: JSON.stringify(topics) }, // Gửi danh sách chủ đề qua query string
        });
    
        return response.data;
    } catch (error) {
        console.error("Error fetching books:", error.response?.data || error.message);
        throw error;
    }
}  

export { 
    FavoriteApi, 
    LastestBookApi, 
    BookDetailApi, 
    BookProposesApi,
    GetAllBookApi,
    CreateBookApi,
    UpdateBookApi,
    DeleteBookApi,
    GetAllTopicApi,
    CreateTopicApi,
    SearchByCategoryApi
};  
