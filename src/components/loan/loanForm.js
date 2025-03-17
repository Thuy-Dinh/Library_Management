import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Navbar from '../HomePage/navbar';
import { BookDetailApi } from '../../api/book';
import { CreateLoanApi } from '../../api/loan';
import './loanForm.css';

function LoanForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const bookId = searchParams.get('bookId');

    const [bookDetail, setBookDetail] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    
    const storedName = localStorage.getItem('userName');
    const storedCode = localStorage.getItem('userCode');
    // const storedEmail = localStorage.getItem('userEmail');
    const storedToken = localStorage.getItem('userToken');

    const [isAuthenticated, setIsAuthenticated] = useState(false); // Quản lý trạng thái đăng nhập
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (storedName && storedToken) {
            setIsAuthenticated(true);
            setUserName(storedName);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const [formData, setFormData] = useState({
        name: storedName || '',
        code: storedCode || '',
        // email: storedEmail || '',
        // phone: '',
        // address: '',
        countDay: 1,
        // frontImage: null,
        // backImage: null,
        note: '',
        method: 'Mượn về nhà'
    });
    
    // const [previewFront, setPreviewFront] = useState(null);
    // const [previewBack, setPreviewBack] = useState(null);

    useEffect(() => {
        if (!bookId) {
            setError('Không tìm thấy ID sách.');
            setLoading(false);
            return;
        }

        const fetchBookDetail = async () => {
            try {
                const response = await BookDetailApi(bookId);
                if (response?.bookDetail) {
                    setBookDetail(response.bookDetail);
                } else {
                    setError('Dữ liệu không hợp lệ');
                }
            } catch (error) {
                setError(error.response?.data?.message || 'Không thể tải sách yêu thích');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetail();
    }, [bookId]);

    // // Giải phóng bộ nhớ khi unmount
    // useEffect(() => {
    //     return () => {
    //         if (previewFront) URL.revokeObjectURL(previewFront);
    //         if (previewBack) URL.revokeObjectURL(previewBack);
    //     };
    // }, [previewFront, previewBack]);

    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // Kiểm tra riêng cho trường countDay
        if (name === "countDay") {
            if (value > 30) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    countDay: "Số ngày mượn không được vượt quá 30.",
                }));
            } else if (value <= 0) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    countDay: "Số ngày mượn phải lớn hơn 0.",
                }));
            } else {
                setErrors((prevErrors) => {
                    const { countDay, ...rest } = prevErrors;
                    return rest; // Loại bỏ lỗi của countDay nếu hợp lệ
                });
            }
        }
    
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };    

    // const handleSingleImageChange = (e, type) => {
    //     const file = e.target.files[0];

    //     if (!file) return;

    //     const validFormats = ['image/jpeg', 'image/png', 'image/jpg'];

    //     if (!validFormats.includes(file.type)) {
    //         alert('Chỉ chấp nhận ảnh định dạng JPEG, PNG, JPG!');
    //         return;
    //     }

    //     if (file.size > 5 * 1024 * 1024) {
    //         alert('Kích thước ảnh phải nhỏ hơn 5MB!');
    //         return;
    //     }

    //     setFormData((prevFormData) => ({
    //         ...prevFormData,
    //         [type]: file,
    //     }));

    //     if (type === 'frontImage') {
    //         setPreviewFront(URL.createObjectURL(file));
    //     } else if (type === 'backImage') {
    //         setPreviewBack(URL.createObjectURL(file));
    //     }
    // };

    // const validatePhone = (phone) => {
    //     const phoneRegex = /^[0-9]{10,12}$/;
    //     return phoneRegex.test(phone);
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra các trường thông tin
        let formErrors = {};

        // if (!formData.phone || !validatePhone(formData.phone)) {
        //     formErrors.phone = 'Vui lòng nhập số điện thoại hợp lệ.';
        // }
        // if (!formData.address) {
        //     formErrors.address = 'Vui lòng nhập địa chỉ.';
        // }
        if (formData.countDay <= 0 || formData.countDay > 30) {
            formErrors.countDay = 'Số ngày mượn phải trong khoảng từ 1 đến 30.';
        }
        // if (!formData.frontImage || !formData.backImage) {
        //     formErrors.idCardImages = 'Vui lòng upload ảnh CCCD.';
        // }

        setErrors(formErrors);

        // Nếu có lỗi thì không gửi form
        if (Object.keys(formErrors).length > 0) return;

        try {
            // await CreateLoanApi(formData.email, bookId, formData.phone, formData.address, formData.countDay, formData.frontImage, formData.backImage, formData.note);
            await CreateLoanApi(formData.code, bookId, formData.countDay, formData.note, formData.method);
            navigate("/request");
        } catch (error) {
            alert('Đăng ký thất bại, vui lòng thử lại.');
            console.error(error);
        }
    };

    return (
        <>
            <Navbar isAuthenticated={isAuthenticated} userName={userName} setIsAuthenticated={setIsAuthenticated} />
            <div className="loan-form">
                <div className="loan-title">
                    <span style={{ fontWeight: 'bold' }}>Đơn đăng ký mượn sách: </span>
                    {bookDetail?.Title || "Không rõ tiêu đề"}
                </div>
                <form className="product-create" onSubmit={handleSubmit}>
                    <label htmlFor="name">
                        <span>Tên</span>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            readOnly
                        />
                    </label>

                    {/* <label htmlFor="Email">
                        <span>Email</span>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            readOnly
                        />
                    </label>
                    <label htmlFor="phone">
                        <span>Số điện thoại</span>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </label>
                    {errors.phone && <div className="error">{errors.phone}</div>}
                    <label htmlFor="address">
                        <span>Địa chỉ</span>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </label>
                    {errors.address && <div className="error">{errors.address}</div>} */}
                    <label htmlFor="countDay">
                        <span>Số ngày mượn (Tối đa 30 ngày)</span>
                        <input
                            type="number"
                            id="countDay"
                            name="countDay"
                            value={formData.countDay}
                            onChange={handleChange}
                            max="30"
                            min="1"
                        />
                    </label>
                    {errors.countDay && <div className="error">{errors.countDay}</div>}

                    <label htmlFor="payment">
                        <span>Cọc (Thanh toán tiền cọc trực tiếp tại thư viện)</span>
                        <input
                            type="text"
                            id="payment"
                            name="payment"
                            value="100.000 đồng"
                            readOnly
                        />
                    </label>
                    {/* <label htmlFor="frontImage">
                        <span>Ảnh mặt trước CCCD</span>
                        <input
                            type="file"
                            id="frontImage"
                            name="frontImage"
                            onChange={(e) => handleSingleImageChange(e, 'frontImage')}
                            accept="image/jpeg, image/png, image/jpg"
                        />
                    </label>
                    <label htmlFor="backImage">
                        <span>Ảnh mặt sau CCCD</span>
                        <input
                            type="file"
                            id="backImage"
                            name="backImage"
                            onChange={(e) => handleSingleImageChange(e, 'backImage')}
                            accept="image/jpeg, image/png, image/jpg"
                        />
                    </label>

                    <div className="preview">
                        {previewFront && <img src={previewFront} alt="Preview Front" className="image-preview" />}
                        {previewBack && <img src={previewBack} alt="Preview Back" className="image-preview" />}
                    </div>

                    {errors.idCardImages && <div className="error">{errors.idCardImages}</div>} */}

                    <label htmlFor="note">
                        <span>Ghi chú</span>
                        <textarea
                            id="note"
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                        />
                    </label>
                    <input type="submit" value="Đăng ký" />
                </form>
            </div>
        </>
    );
}

export default LoanForm;