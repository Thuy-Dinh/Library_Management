import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Mousewheel, Keyboard } from 'swiper/modules';
import { FavoriteApi } from '../../api/book';

function OtherBooks({ isAuthenticated }) {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState(null);  

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

    return (
        <div className='book-content-col'>
            <Swiper
                mousewheel={true}
                keyboard={true}
                direction={'vertical'}
                spaceBetween={10}
                slidesPerView={3}
                modules={[Mousewheel, Keyboard]}
            >
                {books && Array.isArray(books) && books.map((book) => (
                    <SwiperSlide className='book-item-col' key={book.BookID}>
                        <Link to={`/detail-book?id=${book._id}`} >
                            <img src={book.Cover}/>
                            <strong>{book.Title}</strong> 
                        </Link>
                        <div>Đánh giá: {book.Rating}
                        <FontAwesomeIcon icon={faStar}  className='icon-star'/>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default OtherBooks;