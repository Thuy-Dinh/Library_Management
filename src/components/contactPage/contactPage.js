import React from 'react';
import Navbar from '../HomePage/navbar';
import './contact.css';

function ContactPage() {
  return (
    <>
        <Navbar/>
        <div className="contact-container">
        <h1 className="contact-title">📬 Liên Hệ Với Chúng Tôi</h1>
        <p className="contact-subtitle">
            Nếu bạn có bất kỳ thắc mắc hoặc cần hỗ trợ, hãy gửi tin nhắn cho chúng tôi.
        </p>

        <div className="contact-content">
            <form className="contact-form">
            <label>
                Họ và tên:
                <input type="text" placeholder="Nguyễn Văn A" required />
            </label>
            <label>
                Email:
                <input type="email" placeholder="email@example.com" required />
            </label>
            <label>
                Nội dung:
                <textarea placeholder="Viết nội dung bạn cần gửi..." rows="5" required />
            </label>
            <button type="submit">Gửi tin nhắn</button>
            </form>

            <div className="contact-info">
            <h2>📌 Thông tin liên hệ</h2>
            <p><strong>📧 Email:</strong> 4evershop4@gmail.com</p>
            <p><strong>📞 Điện thoại:</strong> (+84)964406858</p>
            <p><strong>🏫 Địa chỉ:</strong> Thư viện BokStory, Số 1, Đại Cồ Việt, Hai Bà Trưng, Hà Nội</p>
            </div>
        </div>
        </div>
    </>
  );
}

export default ContactPage;