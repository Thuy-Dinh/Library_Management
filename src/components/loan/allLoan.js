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
    const [filteredLoans, setFilteredLoans] = useState([]);
    const [books, setBooks] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('Tất cả');

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
                setFilteredLoans(loanData);

                const bookIds = [...new Set(loanData.map((item) => item.BookID))];
                const bookRequests = bookIds.map((id) => BookDetailApi(id));
                const bookResponses = await Promise.all(bookRequests);

                const bookData = {};
                bookResponses.forEach((response, index) => {
                    const bookDetail = response.bookDetail;
                    bookData[bookIds[index]] = bookDetail.length > 0 ? bookDetail[0] : {};
                });

                setBooks(bookData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchLoansAndBooks();
    }, [storedEmail]);

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        if (status === 'Tất cả') {
            setFilteredLoans(loans);
        } else {
            const filtered = loans.filter((loan) => loan.State === status);
            setFilteredLoans(filtered);
        }
    };

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
                <div className='loan-title'>📚 Lịch sử mượn sách</div>

                <div className="filter-buttons">
                    <button onClick={() => handleStatusFilter('Tất cả')} className="filter-btn">Tất cả</button>
                    <button onClick={() => handleStatusFilter('Yêu cầu mượn')} className="filter-btn">Yêu cầu mượn</button>
                    <button onClick={() => handleStatusFilter('Đang mượn')} className="filter-btn">Đang mượn</button>
                    <button onClick={() => handleStatusFilter('Đã trả')} className="filter-btn">Đã trả</button>
                    <button onClick={() => handleStatusFilter('Quá hạn')} className="filter-btn">Quá hạn</button>
                    <button onClick={() => handleStatusFilter('Đã từ chối')} className="filter-btn">Bị từ chối</button>
                </div>

                <div className="loan-detail">
                    {filteredLoans && filteredLoans.length > 0 ? (
                        filteredLoans.map((item, index) => {
                            const book = books[item.BookID] || {};
                            return (
                                <div key={index} className='loan-content'>
                                    <img
                                        src={book.Cover}
                                        alt={book.Title}
                                    />
                                    <div className="body-topic">
                                        <div className="book-title">{book.Title}</div>
                                        <div><strong>Ngày mượn:</strong> {item.DayStart}</div>
                                        <div><strong>Hạn trả:</strong> {item.DayEnd}</div>
                                        <div><strong>Hình thức mượn:</strong> {item.Method}</div>
                                        <div><strong>Cọc:</strong> {item.Payment}</div>
                                        <div><strong>Ghi chú:</strong> {item.Note ? item.Note : "Không có ghi chú"}</div>
                                        <div className="loan-status">
                                            <span className="status-label">Trạng thái: </span>
                                            <span className={`status-badge ${item.State.toLowerCase().replace(/\s/g, '-')}`}>
                                                {item.State === 'Yêu cầu mượn' && '📝 '}
                                                {item.State === 'Đang mượn' && '📚 '}
                                                {item.State === 'Đã trả' && '✅ '}
                                                {item.State === 'Quá hạn' && '⏰ '}
                                                {item.State === 'Đã từ chối' && '❌ '}
                                                {item.State}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div>Không có đơn nào</div>
                    )}
                </div>
            </div>
        </>
    );
}

export default AllLoan;