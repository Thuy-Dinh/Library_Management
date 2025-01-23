import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import Navbar from "../HomePage/navbar";
import Header from "../HomePage/header";
import Footer from "../HomePage/footer";
import { SearchResultApi } from '../../api/book';
import './searchResult.css';

function SearchResult() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState("");
    const [results, setResults] = useState([]); // Kết quả tìm kiếm lưu dưới dạng mảng
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get("keyword"); 
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra người dùng đã đăng nhập
        const storedName = localStorage.getItem("userName");
        const storedToken = localStorage.getItem("userToken");
        if (storedName && storedToken) {
          setIsAuthenticated(true);
          setUserName(storedName);
        } else {
          setIsAuthenticated(false);
        }
    }, []); 

    useEffect(() => {
        // Gọi API để lấy dữ liệu kết quả tìm kiếm
        const fetchSearchResults = async () => {
            if (!keyword) return; // Không làm gì nếu không có từ khóa
            try {
                const data = await SearchResultApi(keyword); // Gọi API
                console.log(data.data);
                setResults(data.data); // Cập nhật state với kết quả trả về
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        };
        fetchSearchResults();
    }, [keyword]); // Chỉ chạy lại khi `keyword` thay đổi

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
        <div>
            <Navbar
                isAuthenticated={isAuthenticated}
                userName={userName}
                setIsAuthenticated={setIsAuthenticated}
            />
            <Header />
            <div className='search-result'>
                <h2>Kết quả tìm kiếm: {keyword}</h2>
                {results.length > 0 ? (
                    results.map((bookDetail) => (
                        <div key={bookDetail._id} className="book-detail book-detail-1">
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
                                <button className='btn-borrow-detail' onClick={() => {handleAvailable(bookDetail)}}>Mượn</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Không tìm thấy kết quả phù hợp.</p>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default SearchResult;