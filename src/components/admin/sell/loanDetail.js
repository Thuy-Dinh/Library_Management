import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetAUserApi } from "../../../api/account";
import { BookDetailApi } from "../../../api/book";
import { getALoanApi } from "../../../api/loan";
import { useNavigate } from "react-router-dom";
import "./loanDetail.css";

export default function OrderDetail() {
    const { id } = useParams();
    const [loan, setLoan] = useState(null);
    const [user, setUser] = useState(null);
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLoan = async () => {
            try {
                const detail = await getALoanApi(id);
                const loanData = detail.loanDetail;
                setLoan(loanData);

                const userRes = await GetAUserApi(loanData.AccountID);
                setUser(userRes.user);

                const bookRes = await BookDetailApi(loanData.BookID);
                setBooks(bookRes.bookDetail);
            } catch (error) {
                console.error("Lỗi khi load chi tiết đơn:", error);
            }
        };

        fetchLoan();
    }, [id]);

    if (!loan || !user || books.length === 0) return <p>Đang tải dữ liệu...</p>;

    return (
        <div className="bill-container">
            <div className="bill-header">
                <div>
                    <img src="/Logo-SVG.png" alt="logo" className="logo" />
                </div>
                <div className="store-info">
                    <h2>THƯ VIỆN BokStory</h2>
                    <p>Địa chỉ: Số 1, Đại Cồ Việt, Hai Bà Trưng, Hà Nội</p>
                </div>
            </div>

            <div className="customer-info">
                <div className="bill-code">Mã đơn: {loan.LoanCode}</div>
                <h3>THÔNG TIN NGƯỜI MƯỢN</h3>
                <table className="user-info-table">
                    <thead>
                        <tr>
                            <th>Mã thẻ</th>
                            <th>Họ tên</th>
                            <th>Số điện thoại</th>
                            <th>Địa chỉ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{user.LbCode}</td>
                            <td>{user.Name}</td>
                            <td>{user.Phone}</td>
                            <td>{user.Address}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>DANH SÁCH SÁCH MƯỢN</h3>
            <table className="book-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Mã sách</th>
                        <th>Tên sách</th>
                        <th>Tác giả</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book, index) => (
                        <tr key={book.BookID || index}>
                            <td>{index + 1}</td>
                            <td>{book.BookCode}</td>
                            <td>{book.Title}</td>
                            <td>{book.Author}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="summary">
                <p><strong>Ngày mượn:</strong> {new Date(loan.DayStart).toLocaleString()}</p>
                <p><strong>Hạn trả:</strong> {new Date(loan.DayEnd).toLocaleString()}</p>
                <p><strong>Hình thức mượn</strong> {loan.Method}</p>
                <p><strong>Cọc:</strong> {loan.Payment}</p>
                <p><strong>Trạng thái đơn hàng:</strong> {loan.State}</p>
                <p><strong>Ghi chú:</strong> {loan.Note || "Không có ghi chú."}</p>
            </div>
            <div className="edit-button-wrapper">
                <button
                    className="edit-button"
                    onClick={() => navigate(`/admin/order-management/loan-edit/${loan._id}`)}
                >
                    ✏️ Chỉnh sửa
                </button>
            </div>
        </div>
    );
}