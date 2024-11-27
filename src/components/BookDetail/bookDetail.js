import React, { useState, useEffect } from "react";
import './bookDetail.css';
import Navbar from "../HomePage/navbar";
import BookDescription from "./bookDescription";
import BookPropose from "./bookPropose";
import BookFavorite from "../HomePage/bookFavorite";
import Footer from "../HomePage/footer";

export default function BookDetail() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
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
        <div className="detail-body">
           <Navbar isAuthenticated={isAuthenticated} userName={userName} setIsAuthenticated={setIsAuthenticated}/>
           <div className="detail-content">
                <div className="detail-top">
                    <div className="detail-left">
                        <BookDescription isAuthenticated={isAuthenticated}/>
                    </div>
                    <div className="detail-right">
                        <h3>Được đề xuất</h3>
                        <BookPropose />
                    </div>
                </div>
                <h1>Được yêu thích</h1>
                <BookFavorite isAuthenticated={isAuthenticated}/>  
           </div>
           <Footer />
        </div>
    );
}