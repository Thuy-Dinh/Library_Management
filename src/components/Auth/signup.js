import React, { useState, useEffect } from "react";
import './signup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from "react-router-dom";
import { SignupApi } from "../../api/account";

export default function Signup({ setIsAuthenticated }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [cccd, setCccd] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [errMessage, setErrMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            navigate("/");
        }
    }, [navigate]);

    const handleSignup = async () => {
        setErrMessage('');

        if (password !== confirmPassword) {
            setErrMessage("Mật khẩu nhập lại không khớp.");
            return;
        }

        try {
            const data = await SignupApi(username, email, password, cccd, phone, address, age, gender);
            if (data && data.errCode !== 0) {
                setErrMessage(data.message);
            } else {
                setErrMessage(data.message);
                localStorage.setItem("token", data.token);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setErrMessage(error.response.data.message);
            }
        }
    };

    const handleShowHidePassword = () => {
        setIsShowPassword(!isShowPassword);
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className='signup-background'>
            <div className='signup-container-left'>
                <div className='signup-content'>
                    <div className='text-title'>Tạo một tài khoản mới</div>

                    <div className='form-group signup-input-row'>
                        <div className='signup-input'>
                            <label>Họ Tên</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Nhập tên người dùng'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className='signup-input'>
                            <label>Email</label>
                            <input
                                type='email'
                                className='form-control'
                                placeholder='Nhập email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className='form-group signup-input-row'>
                        <div className='signup-input'>
                            <label>Mật khẩu</label>
                            <div className='custom-password'>
                                <input
                                    type={isShowPassword ? 'text' : 'password'}
                                    className='form-control'
                                    placeholder='Nhập mật khẩu'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span onClick={handleShowHidePassword}>
                                    <FontAwesomeIcon icon={isShowPassword ? faEye : faEyeSlash} />
                                </span>
                            </div>
                        </div>

                        <div className='signup-input'>
                        <label>Nhập lại mật khẩu</label>
                        <div className='custom-password'>
                            <input
                                type={isShowPassword ? 'text' : 'password'}
                                className='form-control'
                                placeholder='Nhập lại mật khẩu'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <span onClick={handleShowHidePassword}>
                                <FontAwesomeIcon icon={isShowPassword ? faEye : faEyeSlash} />
                            </span>
                        </div>
                        </div>
                    </div>

                    <div className='form-group signup-input-row'>
                        <div className='signup-input'>
                            <label>Số CCCD</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Nhập số CCCD'
                                value={cccd}
                                onChange={(e) => setCccd(e.target.value)}
                            />
                        </div>

                        <div className='signup-input'>
                            <label>Số điện thoại</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Nhập số điện thoại'
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className='form-group signup-input'>
                        <label>Địa chỉ</label>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Nhập địa chỉ'
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <div className='form-group signup-input-row'>
                        <div className='signup-input'>
                            <label>Tuổi</label>
                            <input
                                type='number'
                                className='form-control'
                                placeholder='Nhập tuổi'
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                            />
                        </div>

                        <div className='signup-input'>
                            <label>Giới tính</label>
                            <select
                                className='form-control'
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Không xác định">Không xác định</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ color: 'red', paddingBottom: 15 }}>
                        {errMessage}
                    </div>

                    <div className='text-center'>
                        <button className='text-signup' onClick={handleSignup}>Đăng ký</button>
                    </div>
                </div>
            </div>

            <div className='signup-container-right'>
                <div className='text-center text-welcome'>Chào mừng trở lại!</div>
                <p className='text-center'>Bạn đã có tài khoản? Để tiếp tục công việc, hãy đăng nhập.</p>
                <button className='login-btn' onClick={handleLoginRedirect}>Đăng nhập</button>
            </div>
        </div>
    );
}