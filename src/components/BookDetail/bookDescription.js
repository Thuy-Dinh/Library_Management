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
                if (response) {
                    setBookDetail(response.bookDetail);  
                } else {
                    setError('Dữ liệu không hợp lệ');
                }
            } catch (error) {
                setError('Không thể tải sách yêu thích');
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

    return (
        <div className='book-description'>
            <div className='detail-text'>Chi tiết sách</div>
            <div className='book-detail'>
                <img src={bookDetail.Cover} alt="Book Cover"/>
                <div className='detail-item'>
                    <div style={{ fontWeight: "bold", fontSize: 28 }}>{bookDetail.Title}</div>
                    <div>Tác giả: {bookDetail.Author}</div>
                    <div>Nhà xuất bản: {bookDetail.Publisher}</div>
                    <div>Năm xuất bản: {bookDetail.Publication_year}</div>
                    <div>Tái bản lần thứ {bookDetail.Edition}</div>
                    <div>Ngôn ngữ: {bookDetail.Language}</div>
                    <div>
                        {bookDetail.Rating}
                        <FontAwesomeIcon icon={faStar} className='icon-star'/>
                    </div>
                    <div>Tóm tắt: {bookDetail.Summary}</div>
                    <button className='btn-borrow-detail' onClick={() => {handleAvailable(bookDetail)}}>Mượn</button>
                </div>
            </div>
        </div>
    );
}

export default BookDescription;
