import React, { useState, useEffect } from 'react';
import './request.css';
import Navbar from '../HomePage/navbar';

function Request() {
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
        <div className="request-body">
            <Navbar isAuthenticated={isAuthenticated} userName={userName} setIsAuthenticated={setIsAuthenticated} />
            <div className='request-content'>
                <span>Đơn mượn sách sẽ được phê duyệt trong 24 giờ.</span>
                <span>Vui lòng chờ...</span>
            </div> 
        </div>
    );
}

export default Request;