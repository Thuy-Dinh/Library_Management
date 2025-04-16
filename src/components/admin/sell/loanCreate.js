import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // thêm dòng này
import { font } from '../../../font/Roboto-Regular-normal';
import './loanCreate.css'; 
import { CreateLoanApi } from '../../../api/loan';

function LoanCreate() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        loanCode: '',
        lbCode: '',
        bookCodes: [],
        bookCodeInput: '',
        borrowType: 'Mượn tại chỗ'
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleAddBookCode = () => {
        if (!formData.bookCodeInput.trim()) return;

        setFormData((prevState) => ({
            ...prevState,
            bookCodes: [...prevState.bookCodes, prevState.bookCodeInput.trim()],
            bookCodeInput: ''
        }));
    };

    const handleRemoveBookCode = (index) => {
        setFormData((prevState) => ({
            ...prevState,
            bookCodes: prevState.bookCodes.filter((_, i) => i !== index)
        }));
    };
 
    const handleExportPDF = (newLoanCode) => { 
        const doc = new jsPDF();
        
        // Thêm font và cài đặt font
        doc.addFileToVFS("Roboto.ttf", font);
        doc.addFont("Roboto.ttf", "Roboto", "normal");
        doc.setFont("Roboto");
    
        // Thêm logo (Giả sử logo của thư viện ở đường dẫn này)
        const logo = '/Logo-SVG.png';  // Thay đổi đường dẫn logo của bạn
        doc.addImage(logo, 'PNG', 175, 10, 20, 20);  // Thêm logo vào vị trí (10, 10)
    
        // Tiêu đề Hóa Đơn
        doc.setFontSize(16);
        doc.setTextColor(0, 102, 204);  // Màu xanh cho tiêu đề
        doc.text('PHIẾU MƯỢN SÁCH', 85, 35);  // Vị trí tiêu đề

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); 
        doc.text(`${newLoanCode}`, 20, 25);
        doc.text('Thư viện BokStory', 140, 20);  // Vị trí tiêu đề
        doc.text('Số 1, Đại Cồ Việt, Hai Bà Trưng, Hà Nội', 100, 25);  // Vị trí tiêu đề
    
        // Thông tin khách hàng và hóa đơn
        doc.setFontSize(12);
        doc.setTextColor(255, 10, 10); 
        doc.text(`🧾 Mã thẻ bạn đọc: ${formData.lbCode}`, 20, 45);
        doc.text(`📦 Hình thức mượn: ${formData.borrowType}`, 20, 55);
        doc.text(`🗓️ Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}`, 20, 65);
    
        // Tạo khung bao quanh thông tin
        doc.rect(10, 10, 190, 160);  // Vẽ khung bao quanh phần thông tin (x, y, width, height)
    
        // Dữ liệu bảng
        const tableData = formData.bookCodes.map((code, index) => [
            index + 1,
            code
        ]);
    
        // Bảng danh sách sách mượn
        doc.setFontSize(16);
        doc.setTextColor(0, 102, 204);  // Màu xanh cho tiêu đề
        doc.text('Danh sách sách mượn', 20, 80);  // Vị trí tiêu đề
        autoTable(doc, {
            startY: 85,
            head: [['STT', 'Mã sách']],
            body: tableData,
            styles: {
                font: "Roboto",
                fontSize: 12,
                cellPadding: 5,
                valign: 'middle',
                halign: 'center',
            },
            headStyles: {
                fillColor: [0, 102, 204],  // Màu nền tiêu đề bảng
                textColor: 255,  // Màu chữ tiêu đề bảng
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240]  // Màu nền các dòng chẵn
            },
            columnStyles: {
                0: { cellWidth: 20 },
                1: { cellWidth: 160 }
            },
        });
    
        // Thêm footer
        doc.setFontSize(10);
        doc.setTextColor(100);
        const footerText = 'Thư viện BokStory - www.bookstory.edu.vn';
        const footerWidth = doc.getTextWidth(footerText); // Lấy chiều rộng của footer text
        const footerX = (doc.internal.pageSize.width - footerWidth) / 2; // Căn giữa footer
        doc.text(footerText, footerX, 160);  // Vị trí footer căn giữa dưới cùng
    
        // Lưu PDF với tên có mã thẻ
        doc.save(`don_muon_${formData.lbCode}.pdf`);
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.lbCode || formData.bookCodes.length === 0) {
            setErrorMessage("Vui lòng nhập mã thẻ và ít nhất một mã sách.");
            return;
        }
    
        try {
            const result = await CreateLoanApi(
                formData.lbCode,
                formData.bookCodes,
                1,
                null,
                formData.borrowType,
                0
            );
    
            if (result.errCode === 0 && result.loan) {
                const { LoanCode, LoanID } = result.loan;
    
                setFormData(prev => ({
                    ...prev,
                    loanCode: LoanCode || `LOAN-${LoanID}`
                }));
                
                const newLoanCode = LoanCode || `LOAN-${LoanID}`;
                
                setTimeout(() => {
                    handleExportPDF(newLoanCode);
                    navigate("/admin/order-management");
                }, 200);                
            } else {
                setErrorMessage(result.message || "Lỗi tạo đơn mượn");
            }
        } catch (error) {
            console.error("Lỗi khi tạo đơn:", error);
            setErrorMessage("Lỗi hệ thống khi tạo đơn mượn.");
        }
    };    

    return (
        <div className="book-loan-form-container">
            <h2>📚 Tạo Đơn Mượn Sách</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Mã thẻ bạn đọc</label>
                    <input 
                        type="text" 
                        name="lbCode" 
                        placeholder="Nhập mã thẻ" 
                        value={formData.lbCode} 
                        onChange={handleChange} 
                    />
                </div>

                <div className="form-group">
                    <label>Nhập mã sách</label>
                    <div className="book-code-input">
                        <input
                            type="text"
                            name="bookCodeInput"
                            placeholder="Nhập mã sách"
                            value={formData.bookCodeInput}
                            onChange={handleChange}
                        />
                        <button type="button" onClick={handleAddBookCode}>Thêm</button>
                    </div>
                </div>

                {formData.bookCodes.length > 0 && (
                    <div className="book-code-list">
                        <strong>Danh sách mã sách:</strong>
                        <ul>
                            {formData.bookCodes.map((code, index) => (
                                <li key={index}>
                                    {code} 
                                    <button type="button" onClick={() => handleRemoveBookCode(index)}>❌</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="form-group">
                    <label>Hình thức mượn</label>
                    <input 
                        type="text" 
                        name="borrowType" 
                        value={formData.borrowType} 
                        readOnly
                    />
                </div>

                <button type="submit">Xuất đơn</button>
            </form>
        </div>
    );
}

export default LoanCreate;