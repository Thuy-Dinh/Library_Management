import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Navbar from "../HomePage/navbar";
import Header from "../HomePage/header";
import Footer from "../HomePage/footer";
import { SearchResultApi, BookProposesApi } from '../../api/book';
import './searchResult.css';

function SearchResult() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState("");
    const [results, setResults] = useState([]);
    const [proposedBooks, setProposedBooks] = useState({});
    const [filters, setFilters] = useState({ language: "", year: "" });

    const [sortType, setSortType] = useState("rating");
    const [sortOrder, setSortOrder] = useState("desc");

    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 6;

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get("keyword"); 
    const navigate = useNavigate();

    useEffect(() => {
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
        const fetchSearchResults = async () => {
            if (!keyword) return;
            try {
                const data = await SearchResultApi(keyword);
                setResults(data.data);

                const proposals = {};
                await Promise.all(
                    data.data.map(async (book) => {
                        const response = await BookProposesApi(book._id);
                        proposals[book._id] = response.bookProposes || [];
                    })
                );
                setProposedBooks(proposals);
            } catch (error) {
                console.error("Error fetching search results or proposals:", error);
            }
        };
        fetchSearchResults();
    }, [keyword]);

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
    };

    const filteredAndSortedResults = results
        .filter(book =>
            (!filters.language || book.Language?.toLowerCase().includes(filters.language.toLowerCase())) &&
            (!filters.year || String(book.Publication_year).includes(filters.year))
        )
        .sort((a, b) => {
            let diff = 0;
            if (sortType === "rating") {
                diff = (a.Rating || 0) - (b.Rating || 0);
            } else if (sortType === "price") {
                diff = (a.Price || 0) - (b.Price || 0);
            }
            return sortOrder === "asc" ? diff : -diff;
        });

    // Reset về trang 1 mỗi khi lọc/sắp xếp thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [filters, sortType, sortOrder]);

    // Phân trang
    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = filteredAndSortedResults.slice(indexOfFirstResult, indexOfLastResult);
    const totalPages = Math.ceil(filteredAndSortedResults.length / resultsPerPage);

    return (
        <div>
            <Navbar
                isAuthenticated={isAuthenticated}
                userName={userName}
                setIsAuthenticated={setIsAuthenticated}
            />
            <Header />

            <h2 style={{ textAlign: "center", marginTop: 30 }}>Kết quả tìm kiếm: {keyword}</h2>
            
            <div className='search-result'>
                {/* Sidebar trái */}
                <div className='filter-section'>
                    <h3>Tùy chọn:</h3>

                    <label>
                        Ngôn ngữ:
                        <input 
                            type="text" 
                            value={filters.language}
                            onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                            placeholder="VD: Tiếng Việt"
                        />
                    </label>

                    <label>
                        Năm xuất bản:
                        <input 
                            type="text" 
                            value={filters.year}
                            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                            placeholder="VD: 2023"
                        />
                    </label>

                    <label>
                        Sắp xếp theo:
                        <select 
                            value={sortType} 
                            onChange={(e) => setSortType(e.target.value)}
                        >
                            <option value="rating">Đánh giá</option>
                            <option value="price">Giá</option>
                        </select>
                    </label>

                    <label>
                        Thứ tự:
                        <select 
                            value={sortOrder} 
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="desc">Giảm dần</option>
                            <option value="asc">Tăng dần</option>
                        </select>
                    </label>
                </div>

                {/* Kết quả tìm kiếm bên phải */}
                <div className="result-content">
                    {currentResults.length > 0 ? (
                        currentResults.map((bookDetail) => (
                            <div key={bookDetail._id} className="book-detail book-detail-1">
                                <img src={bookDetail.Cover} alt="Book Cover" />
                                <div className='detail-item'>
                                    <div style={{ fontWeight: "bold", fontSize: 28 }}>
                                        {bookDetail.Title}
                                    </div>
                                    <div>Tác giả: {bookDetail.Author}</div>
                                    <div>Thể loại: {bookDetail.Category?.Name}</div>
                                    <div>Thẻ phụ: {bookDetail.Subcategory}</div>
                                    <div>Từ khóa: {bookDetail.Tag}</div>
                                    <div>Nhà xuất bản: {bookDetail.Publisher}</div>
                                    <div>Năm xuất bản: {bookDetail.Publication_year}</div>
                                    <div>
                                        Tái bản lần thứ {bookDetail.Edition === "First" ? "nhất" : "hai"}
                                    </div>
                                    <div>Ngôn ngữ: {bookDetail.Language}</div>
                                    <div>Giá: {bookDetail.Price}</div>
                                    <div>
                                        {bookDetail.Rating} 
                                        <FontAwesomeIcon icon={faStar} className='icon-star' />
                                    </div>
                                    <div>Tóm tắt: {bookDetail.Summary}</div>
                                    <button 
                                        className='btn-borrow-detail' 
                                        onClick={() => handleAvailable(bookDetail)}
                                    >
                                        Mượn
                                    </button>
                                </div>

                                {proposedBooks[bookDetail._id]?.length > 0 && (
                                    <div className='book-proposes'>
                                        <h4>Sách cùng thể loại:</h4>
                                        <div className='proposed-list'>
                                            {proposedBooks[bookDetail._id].map((b, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className='proposed-item' 
                                                    onClick={() => navigate(`/detail-book?id=${b._id}`)}
                                                >
                                                    <img src={b.Cover} alt={b.Title} />
                                                    <div className='proposed-title'>{b.Title}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>Không tìm thấy kết quả phù hợp.</p>
                    )}

                    {/* PHÂN TRANG */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={currentPage === index + 1 ? "active-page" : ""}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default SearchResult;