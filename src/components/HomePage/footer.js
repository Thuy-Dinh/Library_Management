import React, { useState } from 'react';
import './footer.css';

function Footer() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="footer">
            <div className='footer-left'>
                <h3>Liên lạc</h3>
                <h4>Số 1, Đại Cồ Việt</h4>
                <h4>Hai Bà Trưng, Hà Nội</h4>
                <h4>Email: bookstory@gmail.com</h4>
                <h4>Phone: (+84)964406858</h4>
            </div>
            <div className='footer-center'>
                <div className='col-12 form-group login-input'>
                    <label>Email</label>
                    <input
                        type='email'
                        className='form-control input-text-1'
                        placeholder='Nhập email'
                        id="email"
                        name="email"
                    />
                </div>
                <div className='col-12 form-group login-input'>
                    <label>Mật khẩu</label>
                    <div className="custom-password">
                        <input
                            className='form-control input-text-2'
                            type={showPassword ? "text" : "password"}
                            placeholder='Nhập mật khẩu'
                            id="password"
                            name="password"
                        />
                    </div>
                </div>
            </div>
            <div className='footer-right'>
                <h4>Tổng quan</h4>
                <h4>Câu chuyện</h4>
                <h4>Thể loại</h4>
                <h4>Trích dẫn</h4>
                <h4>Liên lạc</h4>
            </div>
        </div>
    );
}

export default Footer;
