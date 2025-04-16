import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './navbar.css';

function Navbar({ isAuthenticated, userName, setIsAuthenticated }) {
    const [isNavigatorVisible, setIsNavigatorVisible] = useState(false);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();

    const userInitial = userName?.charAt(0)?.toUpperCase() || '';

    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIsNavigatorVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleNavigator = () => {
        setIsNavigatorVisible((prev) => !prev);
    };

    const handleLogout = () => {
        localStorage.clear(); // Xóa tất cả dữ liệu khi đăng xuất
        setIsAuthenticated(false);
        navigate("/"); // Chuyển hướng về trang chủ
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <img 
                    src="https://www.bookinabox.dk/wp-content/uploads/2024/02/Logo-SVG.svg" 
                    alt="logo-book" 
                    className="image-logo"
                />
                <h3 className="logo-text">BoksTory</h3>
            </div>
            <ul className="navbar-content">
                <Link to="/">Trang chủ</Link>
                <Link to="/searchPage">Tra cứu nâng cao</Link>
                <Link to="/guide">Hướng dẫn mượn trả</Link>
                {/* <li>Thể loại</li> */}
                <Link to="/contact">Liên hệ</Link>
            </ul>
            <div>
                {isAuthenticated ? (
                    <div className="navbar-btn">
                        <div className="navbar-user" onClick={toggleNavigator}>
                            <div className="user-img">{userInitial}</div>
                            <div className="user-name">{userName}</div>
                        </div>
                        {isNavigatorVisible && (
                            <div ref={wrapperRef} className="navbar-navigator">
                                <div className="navbar-item"><Link to={"/user-inform"}>Thẻ bạn đọc</Link></div>
                                <div className="navbar-item"><Link to={"/all-Loan"}>Lịch sử mượn sách</Link></div>
                                <div className="navbar-item" onClick={handleLogout}>
                                    Đăng xuất
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="navbar-btn">
                        <Link to="/login">Đăng nhập</Link>
                        <Link to="/signup">Đăng ký</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;