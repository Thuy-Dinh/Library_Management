import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from 'react-router-dom';
import { BookDetailApi, GetCategoryApi } from '../../../api/book';
import "./productDetail.css";

function ProductDetail() {
    const [searchParams] = useSearchParams();
    const bookId = searchParams.get('id'); 

    const [bookDetail, setBookDetail] = useState([]);
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState(null);  

    useEffect(() => {
        const fetchBookDetail = async () => {
          try {
            const response = await BookDetailApi(bookId);
            // 1. response.bookDetail là mảng, lấy phần tử [0]
            const bookArray = response.bookDetail;
            if (!Array.isArray(bookArray) || bookArray.length === 0) {
              throw new Error("Không tìm thấy sách");
            }
            const book = bookArray[0];
            setBookDetail(book);
      
            // 2. Lấy ID thể loại
            const categoryID = book.Category;  // đây là một chuỗi ID
      
            // 3. Gọi API để lấy object thể loại thật sự
            const categoryData = await GetCategoryApi(categoryID);
            setCategory(categoryData);
          } catch (err) {
            console.error(err);
            setError("Không thể tải chi tiết sách");
          } finally {
            setLoading(false);
          }
        };
      
        fetchBookDetail();
    }, [bookId]);   
    
    let statusClass = 'status-unknown';
    let statusLabel = 'Chưa xác định';
    if (bookDetail.Availability === 'Available') {
      statusClass = 'status-available';
      statusLabel = 'Có sẵn';
    } else if (bookDetail.Availability === 'Unavailable') {
      statusClass = 'status-unavailable';
      statusLabel = 'Đang được mượn';
    } else if (bookDetail.Availability === 'Torned') {
      statusClass = 'status-torned';
      statusLabel = 'Bị hỏng';
    }

    if (loading) {
        return <div>Đang tải...</div>;  
    }

    if (error) {
        return <div>{error}</div>;  
    }

    return (
        <>
            <a href='/admin/product-management' className='back-text'>Quay lại</a>
            <div className='book-description-admin'>
                <div className='detail-text'>Chi tiết sách</div>
                <div className='book-detail'>
                    <img src={bookDetail.Cover} alt="Book Cover"/>
                    <div className='detail-item'>
                        <div style={{ fontWeight: "bold", fontSize: 28 }}>{bookDetail.Title}</div>
                        <div>Tác giả: {bookDetail.Author}</div>
                        <div>Thể loại: {category.Name}</div>
                        <div>Thẻ phụ: {bookDetail.Subcategory}</div>
                        <div>Từ khóa: {bookDetail.Tag}</div>
                        <div>Nhà xuất bản: {bookDetail.Publisher}</div>
                        <div>Năm xuất bản: {bookDetail.Publication_year}</div>
                        <div>Tái bản lần thứ {bookDetail.Edition === "First" ? "nhất" : "hai"}</div>
                        <div>Ngôn ngữ: {bookDetail.Language}</div>
                        <div>
                            {bookDetail.Rating}
                            <FontAwesomeIcon icon={faStar} className='icon-star'/>
                        </div>
                        <div>Tóm tắt: {bookDetail.Summary}</div>
                        <div>Vị trí: Khu {bookDetail.Location?.area}, kệ {bookDetail.Location?.shelf}, tầng {bookDetail.Location?.slot}</div>
                        <div className={statusClass}>
                          Trạng thái: {statusLabel}
                        </div>
                    </div>
                </div>
            </div>
        </>   
    );
}

export default ProductDetail;