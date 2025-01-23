import React, { useState } from 'react';
import './header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { searchSuggestionApi } from '../../api/book';
import { useNavigate } from 'react-router-dom';

function Header({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState({ titles: [], categories: [], authors: [] });
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const navigate = useNavigate(); // Sử dụng useNavigate

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchTerm);
        }
    };

    const handleInputChange = async (e) => {
        const keyword = e.target.value;
        console.log(keyword);
        setSearchTerm(keyword);

        if (keyword.trim() === '') {
            setSuggestions({ titles: [], categories: [], authors: [] });
            setIsDropdownVisible(false);
            return;
        }

        try {
            const result = await searchSuggestionApi(keyword);
            console.log(result.data);

            if (result.data) {
                const suggestionsList = result.data.map(item => ({
                    id: item._id,
                    displayText: `${item.Title} - ${item.Author} - ${item.Category}` // Kết hợp thông tin
                }));

                setSuggestions({
                    titles: suggestionsList,
                    categories: suggestionsList,
                    authors: suggestionsList
                });
                setIsDropdownVisible(true); // Hiển thị dropdown
            } else {
                setSuggestions({ titles: [], categories: [], authors: [] });
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const handleSuggestionClick = (displayText) => {
        setSearchTerm(displayText); // Cập nhật giá trị input với từ được chọn
        setIsDropdownVisible(false); // Ẩn dropdown
        handleSearch(); // Gọi hàm tìm kiếm

        // Chuyển hướng đến trang searchResult với từ khóa tìm kiếm
        navigate(`/searchResult?keyword=${encodeURIComponent(displayText.split(' - ')[0])}`);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault(); // Ngăn không cho form mặc định submit
        if (searchTerm.trim() === '') {
            return; // Không làm gì nếu input trống
        }
        setIsDropdownVisible(false); // Ẩn dropdown
        navigate(`/searchResult?keyword=${encodeURIComponent(searchTerm)}`);
    };

    return (
        <div>
            <img
                src="https://img.freepik.com/premium-photo/books-stacked-natural-background_250469-11085.jpg"
                className="background-img"
                alt="background-image"
            />
            <div className="header-text">
                <h3 className="quiz-text">
                    "Sách mở ra trước mắt ta những chân trời mới."
                </h3>
                <h6 className="author-text"> – Maxim Gorky</h6>
            </div>
            <div className="search-bar">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <input
                    type="text"
                    placeholder="Tìm kiếm sách..."
                    value={searchTerm}
                    onChange={handleInputChange} // Gọi hàm khi người dùng nhập
                />
                <button className="btn-search" onClick={handleFormSubmit}> {/* Sử dụng hàm handleFormSubmit */}
                    Tìm kiếm
                </button>
            </div>

            {isDropdownVisible && (
                <div className="dropdown">
                    {suggestions.titles.length > 0 && (
                        <div>
                            <h4>Kết quả tìm kiếm:</h4>
                            <ul>
                                {suggestions.titles.map((item) => (
                                    <li
                                        key={item.id} // Thêm key là _id của mỗi mục
                                        onClick={() => handleSuggestionClick(item.displayText)}
                                    >
                                        {item.displayText}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Header;