import axios from 'axios';

async function CreateLoanApi(userEmail, bookID, phone, address, countDay, frontImage, backImage, note) {
    console.log(userEmail);
    // Prepare the data to be sent in the request
    const formData = new FormData();
    formData.append('userEmail', userEmail);
    formData.append('bookID', bookID);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('countDay', countDay);
    formData.append('frontImage', frontImage);
    formData.append('backImage', backImage);
    formData.append('note', note);

    console.log(formData);

    try {
        // Make the POST request to the server API
        const response = await axios.post('http://localhost:3050/loan/create-loan', {userEmail, bookID, phone, address, countDay, frontImage, backImage, note}, {
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

export { 
    CreateLoanApi, 
    getAllLoanApi,
    acceptLoanApi 
};  
