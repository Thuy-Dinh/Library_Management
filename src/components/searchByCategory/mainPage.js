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
          const response = await SearchByCategoryApi(selectedTopics); // Gửi danh sách chủ đề
          if (response.success && Array.isArray(response.data)) {
            setBooks(response.data); 
          } else {
            console.error("Failed to fetch books:", response.message);
            setBooks([]);
          }
        } else {
          setBooks([]); // Nếu không có chủ đề nào được chọn, đặt về mảng rỗng
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

  return (
    <div className="homepage-body">
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
          <h2>Danh sách sách theo chủ đề</h2>
          <div className="main-content">
            {Array.isArray(books) && books.length > 0 ? (
              books.map((book) => (
                <div className="book-item" key={book.BookID}>
                  <Link to={`/detail-book?id=${book._id}`}>
                    <img src={book.Cover} alt={book.Title} />
                    <strong>{book.Title}</strong>
                  </Link>
                  <div>
                    Đánh giá: {book.Rating}
                    <FontAwesomeIcon icon={faStar} className="icon-star" />
                  </div>
                  <button
                    className="btn-borrow-2"
                    onClick={() => {
                      handleAvailable(book);
                    }}
                  >
                    Mượn
                  </button>
                </div>
              ))
            ) : (
              <p>Không có sách nào phù hợp với chủ đề đã chọn.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}