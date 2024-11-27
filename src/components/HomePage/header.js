import React, { useState } from 'react';
import './hearder.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

function Header({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        if (onSearch) {
            onSearch(searchTerm);
        }
    };

    return (
        <div>
            <img src="https://img.freepik.com/premium-photo/books-stacked-natural-background_250469-11085.jpg" className="background-img" alt='background-image'/>
            <div className='header-text'>
                <h3 className='quiz-text'>"Sách mở ra trước mắt ta những chân trời mới."</h3>
                <h6 className='author-text'> – Maxim Gorky</h6>
            </div>
            <div className="search-bar">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <input 
                    type="text" 
                    placeholder="Tìm kiếm sách..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className='btn-search' onClick={handleSearch}>Tìm kiếm</button>
            </div>
        </div>
    );
}

export default Header;
