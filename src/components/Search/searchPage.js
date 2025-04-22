import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import Navbar from "../HomePage/navbar";
import OtherBooks from "./otherBooks";
import OtherBooks2 from "./otherBooks-2";
import { SearchByOtherField } from "../../api/book";
import { useNavigate } from "react-router-dom";
import "./SearchPage.css";

export default function SearchPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [form, setForm] = useState({
    title: "",
    author: "",
    language: "",
    year: "",
    publisher: "",
    keyword: "",
    sortBy: "title",
    sortOrder: "asc",
    limit: 500,
  });
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 3;
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleReset = () => {
    setForm({
      title: "",
      author: "",
      language: "",
      year: "",
      publisher: "",
      keyword: "",
      sortBy: "title",
      sortOrder: "asc",
      limit: 500,
    });
    setSearchResults([]);
    setCurrentPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
    try {
      const params = new URLSearchParams(form);
      const data = await SearchByOtherField(params);
      setSearchResults(data || []);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
    }
  };

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

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

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} userName={userName} setIsAuthenticated={setIsAuthenticated} />
      <div className="search-body">
        <div className="search-left">
          <form className="search-form" onSubmit={handleSubmit}>
            <div className="search-header">TÌM KIẾM</div>
            <div className="form-grid">
              {[
                { label: "Tiêu đề", name: "title" },
                { label: "Tác giả", name: "author" },
                { label: "Ngôn ngữ", name: "language" },
                { label: "Năm xuất bản", name: "year" },
                { label: "Nhà xuất bản", name: "publisher" },
                { label: "Từ khóa", name: "keyword" },
              ].map((field) => (
                <div className="form-group" key={field.name}>
                  <label htmlFor={field.name}>{field.label}:</label>
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    placeholder={field.label}
                    value={form[field.name]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>

            <div className="form-row">
              <label>Sắp xếp theo:</label>
              <select name="sortBy" value={form.sortBy} onChange={handleChange}>
                <option value="Title">Tiêu đề</option>
                <option value="Author">Tác giả</option>
                <option value="Price">Giá</option>
                <option value="Rating">Mức độ yêu thích</option>
              </select>

              <select name="sortOrder" value={form.sortOrder} onChange={handleChange}>
                <option value="asc">Tăng</option>
                <option value="desc">Giảm</option>
              </select>

              <label>Giới hạn kết quả:</label>
              <select name="limit" value={form.limit} onChange={handleChange}>
                <option value="50">50</option>
                <option value="150">150</option>
                <option value="350">350</option>
                <option value="500">500</option>
                <option value="0">Tất cả</option>
              </select>
              <span>bản ghi</span>
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-child">Tìm kiếm</button>
              <button type="button" className="btn-child" onClick={handleReset}>Đặt lại</button>
            </div>
          </form>

          <div className="search-result-2">
            <h2>Kết quả tìm kiếm</h2>
            {searchResults.length > 0 ? (
              <>
                {currentResults.map((book, index) => (
                  <div key={book._id || index} className="book-detail book-detail-1" style={{ width: 800 }}>
                    <img src={book.Cover} alt="Book Cover" />
                    <div className="detail-item">
                      <div style={{ fontWeight: "bold", fontSize: 28 }}>{book.Title}</div>
                      <div>Tác giả: {book.Author}</div>
                      <div>Thể loại: {book.Category?.Name}</div>
                      <div>Thẻ phụ: {book.Subcategory}</div>
                      <div>Từ khóa: {book.Tag}</div>
                      <div>Nhà xuất bản: {book.Publisher}</div>
                      <div>Năm xuất bản: {book.Publication_year}</div>
                      <div>Tái bản lần thứ {book.Edition === "First" ? "nhất" : "hai"}</div>
                      <div>Ngôn ngữ: {book.Language}</div>
                      <div>Giá: {book.Price}</div>
                      <div>
                        {book.Rating}
                        <FontAwesomeIcon icon={faStar} className="icon-star" />
                      </div>
                      <div>Tóm tắt: {book.Summary}</div>
                      <button className="btn-borrow-detail" onClick={() => handleAvailable(book)}>Mượn</button>
                    </div>
                  </div>
                ))}

                <div className="pagination">
                  <button onClick={goToPrevPage} disabled={currentPage === 1}>Trang trước</button>
                  <span>Trang {currentPage} / {totalPages}</span>
                  <button onClick={goToNextPage} disabled={currentPage === totalPages}>Trang sau</button>
                </div>
              </>
            ) : (
              <p>Không có kết quả.</p>
            )}
          </div>
        </div>

        <div className="search-right">
          <div className="other-text">Sách được yêu thích</div>
          <OtherBooks />
          <div className="other-text">Sách mới thêm</div>
          <OtherBooks2 />
        </div>
      </div>
    </>
  );
}