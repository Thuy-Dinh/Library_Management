import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import Navbar from "../HomePage/navbar";
import Header from "../HomePage/header";
import Footer from "../HomePage/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { GetAllTopicApi, SearchByCategoryApi } from "../../api/book";
import "./mainPage.css";

export default function SearchByCategory() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [topics, setTopics] = useState([]); 
  const [books, setBooks] = useState([]); 
  const [selectedTopics, setSelectedTopics] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get("category"); 

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedToken = localStorage.getItem("userToken");
    if (storedName && storedToken) {
      setIsAuthenticated(true);
      setUserName(storedName);
    } else {
      setIsAuthenticated(false);
    }

    const fetchTopics = async () => {
      try {
        const response = await GetAllTopicApi(); 
        if (response.success) {
          setTopics(response.data); 
          if (selectedCategory) {
            setSelectedTopics([selectedCategory]);
          }
        } else {
          console.error("Failed to fetch topics:", response.message);
        }
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, [selectedCategory]); 

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        if (selectedTopics.length > 0) {
          const response = await SearchByCategoryApi(selectedTopics); 
          if (response.success && Array.isArray(response.data)) {
            setTimeout(() => {
              setBooks(response.data); 
              setCurrentPage(1); // reset về trang đầu khi chọn chủ đề mới
            }, 100); // delay nhẹ để tránh giật UI
          } else {
            console.error("Failed to fetch books:", response.message);
            setBooks([]);
          }
        } else {
          setBooks([]);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]);
      }
    };
  
    fetchBooks();
  }, [selectedTopics]);
  
  const handleTopicChange = (e) => {
    const topicName = e.target.value; 
    setSelectedTopics((prevState) =>
      prevState.includes(topicName)
        ? prevState.filter((name) => name !== topicName)
        : [...prevState, topicName]
    );
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

  const indexOfLastBook = currentPage * itemsPerPage;
  const indexOfFirstBook = indexOfLastBook - itemsPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="homepage-body-2">
      <Navbar
        isAuthenticated={isAuthenticated}
        userName={userName}
        setIsAuthenticated={setIsAuthenticated}
      />
      <Header />

      <div className="search-container">
        <div className="sidebar sidebar-1">
          <h2>Chọn chủ đề</h2>
          {topics.map((topic) => (
            <div key={topic._id} className="topic-checkbox">
              <input
                type="checkbox"
                value={topic.topic} 
                checked={selectedTopics.includes(topic.topic)} 
                onChange={handleTopicChange}
              />
              <label>{topic.topic}</label> 
            </div>
          ))}
        </div>

        <div>
          <h2 style={{ marginBottom: 20, textAlign: "center" }}>
            Danh sách sách theo chủ đề
          </h2>
          <div className="main-content">
            {Array.isArray(books) && books.length > 0 ? (
              currentBooks.map((book) => (
                <div className="book-item-category" key={book.BookID}>
                  <Link to={`/detail-book?id=${book._id}`}>
                    <img src={book.Cover} alt={book.Title} loading="lazy"/>
                    <strong>{book.Title}</strong>
                  </Link>
                  <div>
                    Đánh giá: {book.Rating}
                    <FontAwesomeIcon icon={faStar} className="icon-star" />
                  </div>
                  <button
                    className="btn-borrow-2"
                    onClick={() => handleAvailable(book)}
                  >
                    Mượn
                  </button>
                </div>
              ))
            ) : (
              <p>Không có sách nào phù hợp với chủ đề đã chọn.</p>
            )}
          </div>

          {books.length > itemsPerPage && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={currentPage === i + 1 ? "active" : ""}
                >
                  {i + 1}
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