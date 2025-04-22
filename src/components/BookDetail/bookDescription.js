import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
import './bookDescription.css';
import { BookDetailApi } from '../../api/book';

function BookDescription({ isAuthenticated }) {
    const [searchParams] = useSearchParams();
    const bookId = searchParams.get('id'); 

    const [bookDetail, setBookDetail] = useState([]);
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState(null);  

    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookDetail = async () => {
            try {
                const response = await BookDetailApi(bookId); 
                console.log(response.bookDetail)
                if (response) {
                    setBookDetail(response.bookDetail);  
                } else {
                    setError('Dữ liệu không hợp lệ');
                }
            } catch (error) {
                setError('Không thể tải sách cùng thể loại');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetail();  
    }, [bookId]);  // Chỉ chạy lại nếu bookId thay đổi    

    if (loading) {
        return <div>Đang tải...</div>;  
    }

    if (error) {
        return <div>{error}</div>;  
    }

    const handleAvailable = (book) => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        if (book.Availability.toLowerCase() === "available") {
            navigate(`/form-loan?bookId=${encodeURIComponent(book._id)}`);
        } else {
            alert("Sách không có sẵn!!!");
        }
    }

    const book = bookDetail.length > 0 ? bookDetail[0] : null; 

    return (
        <div className='book-description'>
            {book ? (
                <>
                    <div className='detail-text'>Chi tiết sách</div>
                    <div className='book-detail'>
                        <img src={book.Cover} alt="Book Cover"/>
                        <div className='detail-item'>
                            <div style={{ fontWeight: "bold", fontSize: 28 }}>{book.Title}</div>
                            <div>Tác giả: {book.Author}</div>
                            <div>Khu: {book.Location.area}</div>
                            <div>Thể loại con: {book.Subcategory}</div>
                            <div>Thẻ: {book.Tag}</div>
                            <div>Nhà xuất bản: {book.Publisher}</div>
                            <div>Năm xuất bản: {book.Publication_year}</div>
                            <div>Tái bản lần thứ {book.Edition === "First" ? "nhất" : "hai"}</div>
                            <div>Ngôn ngữ: {book.Language}</div>
                            <div>
                                {book.Rating}
                                <FontAwesomeIcon icon={faStar} className='icon-star'/>
                            </div>
                            <div>Tóm tắt: {book.Summary}</div>
                            <button className='btn-borrow-detail' onClick={() => handleAvailable(book)}>Mượn</button>
                        </div>
                    </div>
                </>
            ) : (
                <div>Không tìm thấy sách</div>
            )}
        </div>
    );
}

export default BookDescription;
