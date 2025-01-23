import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from 'react-router-dom';
import { BookDetailApi } from '../../../api/book';

function ProductDetail() {
    const [searchParams] = useSearchParams();
    const bookId = searchParams.get('id'); 

    const [bookDetail, setBookDetail] = useState([]);
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState(null);  

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

    return (
        <>
            <a href='/admin/product-management' style={{fontSize: 24}}>Quay lại</a>
            <div className='book-description'>
                <div className='detail-text'>Chi tiết sách</div>
                <div className='book-detail'>
                    <img src={bookDetail.Cover} alt="Book Cover"/>
                    <div className='detail-item'>
                        <div style={{ fontWeight: "bold", fontSize: 28 }}>{bookDetail.Title}</div>
                        <div>Tác giả: {bookDetail.Author}</div>
                        <div>Thể loại: {bookDetail.Category.Name}</div>
                        <div>Thẻ phụ: {bookDetail.Subcategory}</div>
                        <div>Từ khóa: {bookDetail.Tag}</div>
                        <div>Nhà xuất bản: {bookDetail.Publisher}</div>
                        <div>Năm xuất bản: {bookDetail.Publication_year}</div>
                        <div>Tái bản lần thứ {bookDetail.Edition = "First" ? "nhất" : "hai"}</div>
                        <div>Ngôn ngữ: {bookDetail.Language}</div>
                        <div>
                            {bookDetail.Rating}
                            <FontAwesomeIcon icon={faStar} className='icon-star'/>
                        </div>
                        <div>Tóm tắt: {bookDetail.Summary}</div>
                    </div>
                </div>
            </div>
        </>   
    );
}

export default ProductDetail;