import axios from 'axios';

async function CreateLoanApi(code, bookID, countDay, note, method, payment) {
    // Prepare the data to be sent in the request
    const formData = new FormData();
    formData.append('code', code);
    formData.append('bookID', bookID);
    formData.append('countDay', countDay);
    formData.append('note', note);

    try {
        // Make the POST request to the server API
        const response = await axios.post('http://localhost:3050/loan/create-loan', {code, bookID, countDay, note, method, payment}, {
            headers: {
                'Content-Type': 'multipart/form-data', 
                "x-rapidapi-host": "file-upload8.p.rapidapi.com",
                "x-rapidapi-key": "your-rapidapi-key-here",
            },
        });

        if (response.status === 200) {
            console.log('Loan request created successfully:', response.data);
            return response.data; // Return the response data from the API
        } else {
            throw new Error('Failed to create loan request');
        }
    } catch (error) {
        console.error('Error creating loan request:', error);
        throw error; // Rethrow the error to be handled by the calling code
    }
};

async function getAllLoanApi(email) {
    try {
        const response = await axios.post("http://localhost:3050/loan/all-loan", {
            email, // Truyền email trong body
        });
        return response.data; 
    } catch (error) {
        console.error(
            'Error fetching loan data:',
            error.response ? error.response.data : error.message
        );
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
}

async function acceptLoanApi(loanID, state) {
    try {
        const response = await axios.post("http://localhost:3050/loan/accept-loan", {
            loanID, 
            state
        });
        return response.data; 
    } catch (error) {
        console.error(
            'Error fetching loan data:',
            error.response ? error.response.data : error.message
        );
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
}

async function getALoanApi(id) {
    try {
        const response = await axios.get(`http://localhost:3050/loan/loan-detail/${id}`);
        return response.data; 
    } catch (error) {
        console.error(
            'Error fetching loan data:',
            error.response ? error.response.data : error.message
        );
        throw error;
    }
}

export { 
    CreateLoanApi, 
    getAllLoanApi,
    acceptLoanApi,
    getALoanApi
};  
