import React, { useEffect, useState } from 'react';
import './bookFavorite.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Mousewheel, Keyboard } from 'swiper/modules';
import { FavoriteApi } from '../../api/book';

function BookFavorite({ isAuthenticated }) {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState(null);  
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavoriteBooks = async () => {
            try {
                const response = await FavoriteApi();  
                if (response && response.success && Array.isArray(response.data)) {
                    setBooks(response.data);  
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
    
        fetchFavoriteBooks();  
    }, []);     

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
        <div className='book-content'>
            <Swiper
                navigation={true}
                mousewheel={true}
                keyboard={true}
                spaceBetween={20}
                slidesPerView={4}
                modules={[Navigation, Mousewheel, Keyboard]}
            >
                {books && Array.isArray(books) && books.map((book) => (
                    <SwiperSlide className='book-item' key={book.BookID}>
                        <Link to={`/detail-book?id=${book._id}`} >
                            <img src={book.Cover}/>
                            <strong>{book.Title}</strong> 
                        </Link>
                        <div>Đánh giá: {book.Rating}
                        <FontAwesomeIcon icon={faStar}  className='icon-star'/>
                        </div>
                        <button className='btn-borrow' onClick={() => {handleAvailable(book)}}>Mượn</button>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default BookFavorite;
