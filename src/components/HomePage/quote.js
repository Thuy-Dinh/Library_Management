import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteRight } from '@fortawesome/free-solid-svg-icons';
import './quote.css';

function Quote() {
    return (
        <div className="book-quote">
            <h2 className='books-title'><FontAwesomeIcon icon={faQuoteRight} /></h2>
            <h3 className='books-quiz'>"Đọc sách chính là một cuộc hành trình để tìm lại chính mình."</h3>
            <h4>– Haruki Murakami</h4>
        </div>
    );
}

export default Quote;
