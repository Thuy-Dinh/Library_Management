import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { font } from '../../../font/Roboto-Regular-normal';
import './loanCreate.css'; 
import { CreateLoanApi } from '../../../api/loan';
import { searchSuggestionApi } from '../../../api/book';

function LoanCreate() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        loanCode: '',
        lbCode: '',
        bookCodes: [],
        bookCodeInput: '',
        borrowType: 'Mượn tại chỗ'
    });

    const [suggestions, setSuggestions] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleBookCodeInputChange = async (e) => {
        const value = e.target.value;
        setFormData({
            ...formData,
            bookCodeInput: value
        });
    
        if (value.trim()) {
            try {
                const res = await searchSuggestionApi(value.trim());
                if (res && res.success && Array.isArray(res.data)) {
                    // Chuyển đổi dữ liệu thành dạng cần thiết
                    const books = res.data.map(book => ({
                        code: book.Code,
                        title: book.Title
                    }));
                    setSuggestions(books);
                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                console.error("Lỗi lấy gợi ý mã sách:", error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    };    

    const handleAddBookCode = () => {
        if (!formData.bookCodeInput.trim()) return;

        setFormData((prevState) => ({
            ...prevState,
            bookCodes: [...prevState.bookCodes, prevState.bookCodeInput.trim()],
            bookCodeInput: ''
        }));

        setSuggestions([]);
    };

    const handleRemoveBookCode = (index) => {
        setFormData((prevState) => ({
            ...prevState,
            bookCodes: prevState.bookCodes.filter((_, i) => i !== index)
        }));
    };

    const handleExportPDF = (newLoanCode) => { 
        const doc = new jsPDF();
        doc.addFileToVFS("Roboto.ttf", font);
        doc.addFont("Roboto.ttf", "Roboto", "normal");
        doc.setFont("Roboto");

        const logo = '/Logo-SVG.png';
        doc.addImage(logo, 'PNG', 175, 10, 20, 20); 

        doc.setFontSize(16);
        doc.setTextColor(0, 102, 204); 
        doc.text('PHIẾU MƯỢN SÁCH', 85, 35);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); 
        doc.text(`${newLoanCode}`, 20, 25);
        doc.text('Thư viện BokStory', 140, 20);  
        doc.text('Số 1, Đại Cồ Việt, Hai Bà Trưng, Hà Nội', 100, 25);  

        doc.setFontSize(12);
        doc.setTextColor(255, 10, 10); 
        doc.text(`🧾 Mã thẻ bạn đọc: ${formData.lbCode}`, 20, 45);
        doc.text(`📦 Hình thức mượn: ${formData.borrowType}`, 20, 55);
        doc.text(`🗓️ Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}`, 20, 65);

        doc.rect(10, 10, 190, 160);  

        const tableData = formData.bookCodes.map((code, index) => [
            index + 1,
            code
        ]);

        doc.setFontSize(16);
        doc.setTextColor(0, 102, 204);  
        doc.text('Danh sách sách mượn', 20, 80);
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
                fillColor: [0, 102, 204],
                textColor: 255,
                fontStyle: 'bold',
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240]
            },
            columnStyles: {
                0: { cellWidth: 20 },
                1: { cellWidth: 160 }
            },
        });

        doc.setFontSize(10);
        doc.setTextColor(100);
        const footerText = 'Thư viện BokStory - www.bookstory.edu.vn';
        const footerWidth = doc.getTextWidth(footerText);
        const footerX = (doc.internal.pageSize.width - footerWidth) / 2;
        doc.text(footerText, footerX, 160);

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
                    <div className="book-code-input" style={{ position: "relative" }}>
                        <input
                            type="text"
                            name="bookCodeInput"
                            placeholder="Nhập mã sách"
                            value={formData.bookCodeInput}
                            onChange={handleBookCodeInputChange}
                        />
                        <button type="button" onClick={handleAddBookCode}>Thêm</button>

                        {suggestions.length > 0 && (
                            <ul className="suggestion-list">
                                {suggestions.map((book, idx) => (
                                    <li
                                        key={idx}
                                        onClick={() => {
                                            setFormData(prevState => ({
                                                ...prevState,
                                                bookCodes: [...prevState.bookCodes, {
                                                    code: book.code,
                                                    title: book.title
                                                }],
                                                bookCodeInput: ''
                                            }));
                                            setSuggestions([]);
                                        }}                                        
                                    >
                                        {book.code} - {book.title}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {formData.bookCodes.length > 0 && (
                    <div className="book-code-list">
                        <strong>Danh sách sách:</strong>
                        <ul>
                        {formData.bookCodes.map((book, index) => (
                            <li key={index}>
                                {book.code}: {book.title}
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