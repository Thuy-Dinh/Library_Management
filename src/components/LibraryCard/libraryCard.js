import React, { useState, useEffect } from 'react';
import Navbar from '../HomePage/navbar';
import { GetAUserApi } from '../../api/account';
import './libraryCard.css'; 

function LibraryCard() {
    const storedName = localStorage.getItem('userName');
    const storedEmail = localStorage.getItem('userEmail');
    const storedToken = localStorage.getItem('userToken');

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState('');
    const [data, setData] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (storedName && storedToken) {
            setIsAuthenticated(true);
            setUserName(storedName);
        } else {
            setIsAuthenticated(false);
        }
    }, [storedName, storedToken]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const storedCode = localStorage.getItem('userCode');
                const response = await GetAUserApi(storedCode);
                setData(response.user);
            } catch (err) {
                setError(err.message);
            }
        };
    
        fetchUser();
    }, [storedEmail]);    

    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // tháng tính từ 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };    

    if (error) {
        return <div className="error-message">Lỗi: {error}</div>;
    }

    return (
        <>
            <Navbar
                isAuthenticated={isAuthenticated}
                userName={userName}
                setIsAuthenticated={setIsAuthenticated}
            />
            <div className="library-card-container">
                <div className="library-card-title">📚 Thẻ Bạn Đọc</div>
                <div className="library-card-info">
                    <div><strong>Mã thẻ:</strong> {data.LbCode}</div>
                    <div><strong>Tên:</strong> {data.Name}</div>
                    <div><strong>Email:</strong> {data.Email}</div>
                    <div><strong>Số CCCD:</strong> {data.CCCDNumber}</div>
                    <div><strong>Số điện thoại:</strong> {data.Phone}</div>
                    <div><strong>Địa chỉ:</strong> {data.Address}</div>
                    <div><strong>Ngày sinh:</strong> {formatDate(data.Age)}</div>
                    <div><strong>Giới tính:</strong> {data.Gender}</div>
                </div>
                <div className="edit-button-container">
                    <button className="edit-button" onClick={() => window.location.href = '/edit-profile'}>
                        ✏️ Chỉnh sửa thông tin
                    </button>
                </div>
            </div>
        </>
    );    
}

export default LibraryCard;