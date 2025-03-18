import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf'; // Import thư viện jsPDF
import './loanCreate.css'; 
import { CreateLoanApi } from '../../../api/loan';

function LoanCreate() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
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

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.setFont('Verdana');
        doc.setFontSize(16);
        doc.text('Đơn Mượn Sách', 20, 20);
        
        doc.setFontSize(12);
        doc.text(`Mã thẻ bạn đọc: ${formData.lbCode}`, 20, 40);
        doc.text(`Hình thức mượn: ${formData.borrowType}`, 20, 50);
        
        doc.text('Danh sách mã sách:', 20, 65);
        formData.bookCodes.forEach((code, index) => {
            doc.text(`${index + 1}. ${code}`, 30, 75 + index * 10);
        });

        doc.save(`don_muon_${formData.lbCode}.pdf`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.lbCode || formData.bookCodes.length === 0) {
            setErrorMessage("Vui lòng nhập mã thẻ và ít nhất một mã sách.");
            return;
        }

        console.log("Dữ liệu đơn mượn:", formData);
        alert("Đơn mượn sách đã được gửi!");

        await CreateLoanApi(formData.lbCode, formData.bookCodes, 1, null, formData.borrowType, 0); 
        
        handleExportPDF(); // Xuất PDF sau khi tạo đơn mượn
        
        navigate("/admin/order-management");
        setErrorMessage('');
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