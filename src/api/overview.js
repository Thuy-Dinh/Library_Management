import axios from 'axios';

async function totalBookApi() {
    try {
        const response = await axios.get('http://localhost:3050/overwiew/total-book');

        return response.data;  
    } catch (error) {
        console.error('Error fetching total books:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function availableBookApi() {
    try {
        const response = await axios.get('http://localhost:3050/overwiew/available-book');

        return response.data;  
    } catch (error) {
        console.error('Error fetching available books:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function topBorrowedBookApi() {
    try {
        const response = await axios.get('http://localhost:3050/overwiew/top-book');

        return response.data;  
    } catch (error) {
        console.error('Error fetching available books:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function countBorrowedBookApi(day, month, year) {
    try {
        const response = await axios.post('http://localhost:3050/overwiew/count-book-borrowed', {
            day: day,
            month: month,
            year: year
        });

        return response.data;  
    } catch (error) {
        console.error('Error fetching available books:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function countDamagedBooksApi() {
    try {
        const response = await axios.get('http://localhost:3050/overwiew/damaged-books');

        return response.data;  
    } catch (error) {
        console.error('Error fetching total books:', error.response ? error.response.data : error.message);
        throw error;
    }
}

async function borrowedByMonthApi(year) {
    try {
        console.log(year);
        const response  = await axios.get(`http://localhost:3050/overwiew/borrowed-by-month?year=${year}`);
        return response.data;  
    } catch (error) {
      console.error('Error fetching monthly borrow stats:', error);
      throw error;  
    }
};

export { 
    totalBookApi, 
    availableBookApi,
    topBorrowedBookApi,
    countBorrowedBookApi,
    countDamagedBooksApi,
    borrowedByMonthApi
};  