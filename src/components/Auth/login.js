import React, { useState, useEffect } from "react";
import './login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from "react-router-dom";
import { LoginApi } from "../../api/account";

export default function Login({ setIsAuthenticated }) {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [errMessage, setErrMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra nếu đã có token trong localStorage, tự động chuyển hướng tới trang chủ
        const token = localStorage.getItem('userToken');
        if (token) {
            navigate("/"); // Đã đăng nhập, chuyển hướng tới trang chủ
        }
    }, [navigate]);

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleLogin();
        }
    };

    const handleLogin = async () => {
        try {
            const response = await LoginApi(email, password);
            console.log(response);

            if (response.errCode === 0) {
                // Kiểm tra xem API trả về token không
                if (response.token) {
                    // Lưu token vào localStorage
                    localStorage.setItem('userToken', response.token);
                }

                // Lưu thông tin người dùng vào localStorage
                localStorage.setItem('userName', response.account.Name);
                localStorage.setItem('userEmail', response.account.Email);
                setIsAuthenticated(true); // Cập nhật trạng thái đăng nhập

                if(response.account.Role === 'user') {
                    navigate('/');
                }
                else if(response.account.Role === 'admin')
                    navigate('/admin/overview');             
                setErrMessage('');
            } else {
                setErrMessage(response.message || 'Đăng nhập không thành công.');
            }
        } catch (error) {
            if (error.response) {
                setErrMessage(error.response.data.message || 'Đã xảy ra lỗi, vui lòng thử lại.');
            } else if (error.request) {
                setErrMessage('Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.');
            } else {
                setErrMessage('Đã xảy ra lỗi. Vui lòng thử lại.');
            }
            console.error('Error during login:', error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLoginRedirect = () => {
        navigate('/signup');
    };

    return (
        <div className='login-background'>
            <div className='login-container-left'>
                <div className='text-center text-welcome'>Chào mừng trở lại!</div>
                <p className='text-center'>Bạn chưa có tài khoản? Hãy đăng ký.</p>
                <button className='signup-btn' onClick={handleLoginRedirect}>Đăng ký</button>
            </div>
            <div className='login-container-right'>
                <div className='col-12 text-title'>Đăng nhập</div>
                <div className='col-12 form-group login-input'>
                    <label>Email</label>
                    <input
                        type='email'
                        className='form-control input-text-1'
                        placeholder='Nhập email'
                        id="email"
                        name="email"
                        onChange={(event) => setEmail(event.target.value)}
                        onKeyPress={handleKeyPress}
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
                            onChange={(event) => setPassword(event.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <FontAwesomeIcon
                            icon={showPassword ? faEye : faEyeSlash}
                            className="toggle-password"
                            onClick={togglePasswordVisibility}
                        />
                    </div>
                </div>
                {errMessage && <div className='col-12' style={{ color: 'red' }}>{errMessage}</div>}
                <button className='text-login' onClick={handleLogin}>Đăng nhập</button>
                <div className='col-12 forgot-password'>
                    <span>Quên mật khẩu?</span>
                </div>
                <div className='other-login'>
                    <div className='line'></div>
                    <div>Hoặc đăng nhập bằng</div>
                    <div className='line'></div>
                </div>
                <div className='col-12 social-login'>
                    <i><FontAwesomeIcon icon={faGoogle}/></i>
                    <i><FontAwesomeIcon icon={faFacebook}/></i>
                </div>
            </div>
        </div>
    );
}
