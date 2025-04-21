import React, { useState, useEffect } from 'react';
import { GetAUserApi, UpdateUserApi } from '../../api/account';
import { useNavigate } from 'react-router-dom';
import Navbar from '../HomePage/navbar';
import './editProfile.css';

function EditProfile() {
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

    const navigate = useNavigate();
    const storedCode = localStorage.getItem('userCode');
    const [userData, setUserData] = useState({
        Name: '',
        Email: '',
        CCCDNumber: '',
        Phone: '',
        Address: '',
        Age: '',
        Gender: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await GetAUserApi(storedCode);
                setUserData(res.user);
            } catch (err) {
                setError('Không thể lấy thông tin người dùng');
            }
        };
        fetchUser();
    }, [storedCode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await UpdateUserApi(storedCode, userData);
            alert('Cập nhật thành công!');
            navigate('/user-inform');
        } catch (err) {
            setError('Cập nhật thất bại!');
        }
    };

    return (
        <>
            <Navbar isAuthenticated={isAuthenticated} userName={userName} setIsAuthenticated={setIsAuthenticated}/>
            <div className="edit-profile-container">
                <h2>📝 Chỉnh sửa thông tin</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="edit-profile-form">
                    <div className="form-columns">
                        <div className="form-column">
                            <label>Tên:
                                <input type="text" name="Name" value={userData.Name} onChange={handleChange} />
                            </label>
                            <label>Email:
                                <input type="email" name="Email" value={userData.Email} onChange={handleChange} />
                            </label>
                            <label>CCCD:
                                <input type="text" name="CCCDNumber" value={userData.CCCDNumber} onChange={handleChange} />
                            </label>
                            <label>SĐT:
                                <input type="text" name="Phone" value={userData.Phone} onChange={handleChange} />
                            </label>
                        </div>
                        <div className="form-column">
                            <label>Địa chỉ:
                                <input type="text" name="Address" value={userData.Address} onChange={handleChange} />
                            </label>
                            <label>Tuổi:
                                <input type="number" name="Age" value={userData.Age} onChange={handleChange} />
                            </label>
                            <label>Giới tính:
                                <select name="Gender" value={userData.Gender} onChange={handleChange}>
                                    <option value="">-- Chọn giới tính --</option>
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="save-button">💾 Lưu thay đổi</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default EditProfile;