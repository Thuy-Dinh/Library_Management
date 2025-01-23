import React, { useEffect, useState } from 'react';
import './bookPropose.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Mousewheel, Keyboard } from 'swiper/modules';
import { useSearchParams } from 'react-router-dom';
import { BookProposesApi } from '../../api/book';

function BookPropose() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);  // State để theo dõi trạng thái loading
    const [error, setError] = useState(null);  // State để xử lý lỗi

    const [searchParams] = useSearchParams();
    const bookId = searchParams.get('id'); 
    // Sử dụng useEffect để gọi API khi component render
    useEffect(() => {
        const fetchBookPropose = async () => {
            try {
                const response = await BookProposesApi(bookId);  // Gọi API lấy dữ liệu yêu thích
                console.log(response);
                if (response && Array.isArray(response.bookProposes)) {
                    setBooks(response.bookProposes);  
                } else {
                    setError('Dữ liệu không hợp lệ');
                }
            } catch (error) {
                setError('Không thể tải sách đề xuất');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchBookPropose();  // Gọi hàm lấy dữ liệu từ API
    }, [bookId]);     

    if (loading) {
        return <div>Đang tải...</div>;  // Hiển thị khi đang tải
    }

    if (error) {
        return <div>{error}</div>;  // Hiển thị lỗi nếu có
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

export default BookPropose;
