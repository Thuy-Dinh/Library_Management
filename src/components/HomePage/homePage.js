import React, { useState, useEffect } from "react";
import './homePage.css';
import Navbar from "./navbar";
import Header from "./header";
import BookFavorite from "./bookFavorite";
import BookLastest from "./bookLastest";
import Category from "./category";
import Quote from "./quote";
import Footer from "./footer";

export default function HomePage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Quản lý trạng thái đăng nhập
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        const storedToken = localStorage.getItem('userToken');
        if (storedName && storedToken) {
            setIsAuthenticated(true);
            setUserName(storedName);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    return (
        <div className="homepage-body">
           <Navbar isAuthenticated={isAuthenticated} userName={userName} setIsAuthenticated={setIsAuthenticated} />
           <Header />
           <Quote />
           <div>
                <h2 className='books-title'>Sách được yêu thích</h2>
                <h3 className='books-quiz'>"Người đọc sách sống được hàng ngàn cuộc đời trước khi họ chết... 
                    Người không bao giờ đọc sách chỉ sống một lần."</h3>
                <h4>– George R.R. Martin</h4>
           </div>
            <BookFavorite isAuthenticated={isAuthenticated} />
            <div>
                <h2 className='books-title'>Sách mới thêm</h2>
                <h3 className='books-quiz'>"Một cuốn sách là giấc mơ mà bạn cầm trong tay."</h3>
                <h4>– Neil Gaiman</h4>
            </div>
           <BookLastest isAuthenticated={isAuthenticated}/>
           <Category />
           <Quote />
           <Footer />
        </div>
    );
}