import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import './userEdit.css';

export default function UserEdit() {
    const location = useLocation();
    const user = location.state?.user;

    // Tạo state để lưu trữ các giá trị có thể chỉnh sửa
    const [email, setEmail] = useState(user?.email || "");
    const [name, setName] = useState(user?.name || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [address, setAddress] = useState(user?.address || "");

    const handleSubmit = (event) => {
        event.preventDefault();
        // Xử lý khi form được submit, có thể thêm logic cập nhật dữ liệu ở đây
        console.log("Updated User Info:", { email, name, phone, address });
    };

    return (
        <div className="user-container">
            <div className="user-header">
                <h1>Quản lý tài khoản/Chỉnh sửa thông tin tài khoản</h1>
            </div>
            {user && (
                <form className="user-edit" onSubmit={handleSubmit}>
                    <div>
                        <div>Cập nhật: {name}</div>
                    </div>
                    <label htmlFor="email">
                        <span>Email</span> 
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    <label htmlFor="name">
                        <span>Tên</span>
                        <input 
                            type="text" 
                            id="name" 
                            name="name" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                    <label htmlFor="phone">
                        <span>Số điện thoại</span>
                        <input 
                            type="number" 
                            id="phone" 
                            name="phone" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </label>
                    <label htmlFor="address">
                        <span>Địa chỉ</span>
                        <input 
                            type="text" 
                            id="address" 
                            name="address" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </label>
                    <input type="submit" value="Chỉnh sửa"/>
                </form>
            )}
        </div>
    );
}
