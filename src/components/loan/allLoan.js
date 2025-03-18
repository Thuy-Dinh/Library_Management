import React, { useState, useEffect } from 'react';
import Navbar from '../HomePage/navbar';
import './allLoan.css';
import { BookDetailApi } from '../../api/book';
import { getAllLoanApi } from '../../api/loan';

function AllLoan() {
    const storedName = localStorage.getItem('userName');
    const storedEmail = localStorage.getItem('userEmail');
    const storedToken = localStorage.getItem('userToken');

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState('');
    const [loans, setLoans] = useState([]);
    const [books, setBooks] = useState({}); // State lưu thông tin chi tiết sách theo BookID
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (storedName && storedToken) {
            setIsAuthenticated(true);
            setUserName(storedName);
        } else {
            setIsAuthenticated(false);
        }
    }, [storedName, storedToken]);

    useEffect(() => {
        const fetchLoansAndBooks = async () => {
            try {
                const loanResponse = await getAllLoanApi(storedEmail);
                const loanData = loanResponse.allLoan || [];
                setLoans(loanData);
    
                // Lấy danh sách BookID duy nhất
                const bookIds = [...new Set(loanData.map((item) => item.BookID))];
                const bookRequests = bookIds.map((id) => BookDetailApi(id));
                const bookResponses = await Promise.all(bookRequests);
    
                // Ánh xạ BookID với chi tiết sách (chỉ lấy phần tử đầu tiên)
                const bookData = {};
                bookResponses.forEach((response, index) => {
                    const bookDetail = response.bookDetail;
                    bookData[bookIds[index]] = bookDetail.length > 0 ? bookDetail[0] : {}; 
                });
    
                setBooks(bookData); // Lưu trữ ánh xạ BookID -> bookDetail
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
    
        fetchLoansAndBooks();
    }, [storedEmail]);    

    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    return (
        <>
            <Navbar
                isAuthenticated={isAuthenticated}
                userName={userName}
                setIsAuthenticated={setIsAuthenticated}
            />
            <div className='loan-body'>
                <div className='loan-title'>Lịch sử mượn sách</div>
                <div className="loan-detail">
                    {loans && loans.length > 0 ? (
                        loans.map((item, index) => {
                            const book = books[item.BookID] || {}; // Lấy thông tin sách từ BookID
                            return (
                                <div key={index} className='loan-content'>
                                    <img
                                        src={book.Cover}
                                        alt={book.Title}
                                    />
                                    <div className="body-topic">
                                        <div style={{fontSize: 30, fontWeight: 'bold'}}>{book.Title}</div>
                                        <div><span style={{fontWeight: 'bold'}}>Ngày mượn: </span>{item.DayStart}</div>
                                        <div><span style={{fontWeight: 'bold'}}>Hạn trả: </span>{item.DayEnd}</div>
                                        <div><span style={{fontWeight: 'bold'}}>Hình thức mượn: </span>{item.Method}</div>
                                        <div><span style={{fontWeight: 'bold'}}>Cọc: </span>{item.Payment}</div>
                                        <div><span style={{fontWeight: 'bold'}}>Ghi chú: </span>{item.Note ? item.Note : "Không có ghi chú"}</div>
                                        <div><span style={{fontWeight: 'bold'}}>Trạng thái: </span><span style={{color: 'red'}}>{item.State}</span></div>
                                    </div>   
                                </div>
                            );
                        })
                    ) : (
                        <div>Không có dữ liệu</div>
                    )}
                </div>
            </div>
        </>
    );
}

export default AllLoan;