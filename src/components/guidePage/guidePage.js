import React, {useState, useEffect} from 'react';
import './guidePage.css';
import Navbar from '../HomePage/navbar';

const steps = [
  {
    title: '1. Tra cứu sách',
    icon: '🔍',
    subItems: [
      '- Sử dụng thanh tìm kiếm để nhập tên sách, tác giả hoặc thể loại.',
      '- Sử dụng công cụ tìm kiếm nâng cao để tra cứu theo các trường thông tin khác như nhà xuất bản, năm xuất bản, từ khóa, ngôn ngữ, ...',
    ],
  },
  {
    title: '2. Xem thông tin chi tiết sách',
    description: 'Xem các thông tin sách như tiêu đề, tác giả, năm xuất bản,...',
    icon: '📖',
  },
  {
    title: '3. Đăng nhập / Đăng ký',
    icon: '📝',
    subItems: [
      '- Người dùng đăng ký để tạo tài khoản và thẻ bạn đọc.',
      '- Đăng nhập để có thể mượn sách về nhà.',
    ],
  },
  {
    title: '4. Mượn sách',
    icon: '✅',
    subItems: [
      '📍 *Mượn tại chỗ* (tối đa 3 quyển/1 lần):',
      '     + Chọn sách muốn mượn và xuất trình CCCD tại thư viện.',
      '     + Thủ thư kiểm tra CCCD và in đơn mượn.',
      '     + Dùng đơn mượn để vào phòng đọc.',
      '',
      '📦 *Mượn về nhà* (tối đa 5 quyển/1 lần):',
      '     + Chọn sách và gửi yêu cầu mượn trên hệ thống.',
      '     + Đợi email xác nhận hoặc từ chối.',
      '     + Nếu được duyệt, đến thư viện lấy sách và đóng cọc 50% giá trị sách.',
      '     + Nếu bị từ chối, có thể liên hệ thư viện để biết nguyên nhân.',
    ],
  },
  {
    title: '5. Trả sách',
    icon: '📦',
    subItems: [
      '– Đem sách đến quầy thủ thư khi đọc xong hoặc đến hạn.',
      '– Đảm bảo trả đúng thời hạn để tránh bị xử phạt.',
    ],
  },
  {
    title: '6. Nhận thông báo',
    icon: '🔔',
    description:
      'Hệ thống sẽ gửi email các thông tin xác thực tài khoản và mượn trả sách như nhắc trả sách đến hạn đến email bạn đọc.',
  },
];

function GuidePage() {
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

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} userName={userName} setIsAuthenticated={setIsAuthenticated}/>
      <div className="guide-container">
        <h1 className="guide-title">📚 Hướng Dẫn Tra Cứu – Mượn Trả Sách</h1>
        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="step-icon">{step.icon}</div>
              <div className="step-content">
                <h2 className="step-title">{step.title}</h2>
                <p className="step-description">{step.description}</p>
                {step.subItems && (
                  <ul className="step-list">
                    {step.subItems.map((item, idx) => (
                      <li key={idx} className="step-list-item">{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="guide-footer">
          Mọi thắc mắc vui lòng liên hệ số điện thoại hoặc gửi email đến thư viện BokStory.
        </div>
      </div>
    </>
  );
}

export default GuidePage;