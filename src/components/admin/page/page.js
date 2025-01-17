import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge, faUser, faBook, faFile, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Outlet, useNavigate } from "react-router-dom";
import './page.css';

const Dashboard = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();

    const handleSectionChange = (url) => {
        navigate(url);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.clear(); // Xóa tất cả dữ liệu khi đăng xuất
        navigate("/"); // Chuyển hướng về trang chủ
    };

    return (
        <div className="dashboard">
            <div className="sidebar">
                <div className="dashboard-logo">
                    <img
                        src="https://www.bookinabox.dk/wp-content/uploads/2024/02/Logo-SVG.svg"
                        alt="logo-book"
                        className="home-logo"
                    />
                    <h3 className="home-text">BoksTory</h3>
                </div>
                <div className='sidebar-content'>
                    <div onClick={() => handleSectionChange('/admin/overview')} className='sidebar-item'>
                        <FontAwesomeIcon icon={faGauge} /> Tổng quan
                    </div>
                    <div onClick={() => handleSectionChange('/admin/user-management')} className='sidebar-item'>
                        <FontAwesomeIcon icon={faUser} /> Quản lý tài khoản
                    </div>
                    <div onClick={() => handleSectionChange('/admin/product-management')} className='sidebar-item'>
                        <FontAwesomeIcon icon={faBook} /> Quản lý sách
                    </div>
                    <div onClick={() => handleSectionChange('/admin/order-management')} className='sidebar-item'>
                        <FontAwesomeIcon icon={faFile} /> Quản lý đơn mượn
                    </div>
                    <div onClick={handleLogout} className='sidebar-item'>
                        <FontAwesomeIcon icon={faRightFromBracket} /> Đăng xuất
                    </div>
                </div>
            </div>
            <div className="dashboard-content">
                <Outlet /> 
            </div>
        </div>
    );
};

export default Dashboard;