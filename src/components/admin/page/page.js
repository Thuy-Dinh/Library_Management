import React, { useState } from 'react';
import Overview from '../overview/overview';
import UserManagement from '../userManagement/userManagement';
import ProductManagement from '../bookManagament/productManagement';
import LoanDetail from '../sell/loanDetail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge, faUser, faBook, faFile, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import './page.css';

const Dashboard = ( {setIsAuthenticated} ) => {
    // State to track which content to display
    const [activeSection, setActiveSection] = useState('overview');

    // Function to handle the section change
    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear(); // Xóa tất cả dữ liệu khi đăng xuất
        setIsAuthenticated(false);
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
          <div onClick={() => handleSectionChange('overview')} className='sidebar-item'><FontAwesomeIcon icon={faGauge} />Tổng quan</div>
          <div onClick={() => handleSectionChange('userManagement')} className='sidebar-item'><FontAwesomeIcon icon={faUser} />Quản lý tài khoản</div>
          <div onClick={() => handleSectionChange('productManagement')} className='sidebar-item'><FontAwesomeIcon icon={faBook} />Quản lý sách</div>
          <div onClick={() => handleSectionChange('orderManagement')} className='sidebar-item'><FontAwesomeIcon icon={faFile} />Quản lý đơn hàng</div>
          <div onClick={handleLogout} className='sidebar-item'><FontAwesomeIcon icon={faRightFromBracket} />Đăng xuất</div>
        </div>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-item-content">
          {activeSection === 'overview' && <Overview />}
          {activeSection === 'userManagement' && <UserManagement />}
          {activeSection === 'productManagement' && <ProductManagement />}
          {activeSection === 'orderManagement' && <LoanDetail />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
