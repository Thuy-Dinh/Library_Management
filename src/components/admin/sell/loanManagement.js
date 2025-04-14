import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCirclePlus, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
// import { faMagnifyingGlass, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { GetAUserApi } from "../../../api/account";
import { BookDetailApi } from "../../../api/book";
import { getAllLoanApi, acceptLoanApi } from "../../../api/loan";
import './loanManagement.css';
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";


export default function LoanManagement() {
    const [data, setData] = useState([]);
    const [users, setUsers] = useState({}); 
    const [books, setBooks] = useState({}); 
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    dayjs.extend(utc);
    dayjs.extend(timezone);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const email = localStorage.getItem('userEmail');
                const loans = await getAllLoanApi(email);
                if (loans && Array.isArray(loans.allLoan)) {
                    setData(loans.allLoan);

                    const userIds = [...new Set(loans.allLoan.map((item) => item.AccountID))];
                    const userRequests = userIds.map((id) => GetAUserApi(id));
                    const userResponses = await Promise.all(userRequests);

                    // Ánh xạ BookID với chi tiết sách
                    const userData = {};
                    userResponses.forEach((response, index) => {
                        const userDetail = response.user;
                        userData[userIds[index]] = userDetail;
                    });

                    setUsers(userData);

                    const bookIds = [...new Set(loans.allLoan.map((item) => item.BookID))];
                    const bookRequests = bookIds.map((id) => BookDetailApi(id));
                    const bookResponses = await Promise.all(bookRequests);

                    // Ánh xạ BookID với chi tiết sách
                    const bookData = {};
                    bookResponses.forEach((response, index) => {
                        const bookDetail = response.bookDetail;
                        bookData[bookIds[index]] = bookDetail;
                    });

                    console.log(bookData);
                    setBooks(bookData);
                } else {
                    console.error("Dữ liệu không hợp lệ:", loans);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };
        fetchData();
    }, []); 

    const handleAccept = async (loanID, state) => {
        try {
            // Gọi API duyệt yêu cầu mượn
            await acceptLoanApi(loanID, state);
    
            // Sau khi duyệt, gọi lại API để lấy dữ liệu mượn mới nhất từ database
            const email = localStorage.getItem('userEmail');
            const loans = await getAllLoanApi(email);
            if (loans && Array.isArray(loans.allLoan)) {
                setData(loans.allLoan);  // Cập nhật lại dữ liệu sau khi duyệt
            } else {
                console.error("Dữ liệu không hợp lệ:", loans);
            }
        } catch (error) {
            console.error("Lỗi khi duyệt yêu cầu mượn:", error);
        }
    };       

    const [searchInput, setSearchInput] = useState("");

    const handleChange = (e) => {
        setSearchInput(e.target.value);
        setCurrentPage(1); 
    };

    const filteredData = data?.filter((item) => {
        const userName = users[item.AccountID]?.Name?.toLowerCase() ?? "";
        const title = books[item.BookID]?.Title?.toLowerCase() ?? "";
        
        return (
            title.includes(searchInput.toLowerCase()) ||
            userName.includes(searchInput.toLowerCase())
        );
    }) || [];    

    const totalPages = Math.ceil(filteredData.length / recordsPerPage);

    const indexOfLastRecord = currentPage > totalPages ? 1 : currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="product-container">
            <div className="product-body">
                <div className="product-header">
                    <h1>Danh sách đơn mượn sách</h1>
                    <div className="product-content">
                        <div className="product-search">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                            <input
                                name="search"
                                placeholder="Tìm kiếm đơn theo tên người dùng hoặc sách..."
                                value={searchInput}
                                onChange={handleChange}
                            />
                        </div>
                        <Link to="/admin/order-management/order-create" className="btn-add">
                            <FontAwesomeIcon icon={faCirclePlus} />
                            <span>Tạo đơn</span>
                        </Link>
                    </div>   
                </div>
                
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Mã đơn</th>
                            <th>Người mượn</th>
                            <th>Sách</th>
                            <th>Ngày mượn</th>
                            <th>Hạn trả</th>
                            <th>Hình thức</th>
                            <th>Trạng thái</th>
                            <th>Duyệt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.map((item, index) => {
                            const user = users[item.AccountID] || {};
                            const book = books[item.BookID] || {};
                            const autoIncrementID = (currentPage - 1) * recordsPerPage + index + 1;

                            const isLoaning = item.State === "Đang mượn";
                            const isReturned = item.State === "Đã trả";
                            const isRefuse = item.State === "Đã từ chối";
                            return (
                                <tr key={item.LoanID}>
                                    <td>{item.LoanCode}</td>
                                    <td>{user.Name}</td>
                                    <td>
                                        {Array.isArray(books[item.BookID]) 
                                            ? books[item.BookID].map(book => <div key={book._id}>{book.Title}</div>) 
                                            : books[item.BookID]?.Title}
                                    </td>
                                    <td>
                                        {dayjs(item.DayStart, "DD/MM/YYYY")
                                            .tz("Asia/Ho_Chi_Minh")
                                            .format("DD/MM/YYYY")}
                                        </td>
                                        <td>
                                        {dayjs(item.DayEnd, "DD/MM/YYYY")
                                            .tz("Asia/Ho_Chi_Minh")
                                            .format("DD/MM/YYYY")}
                                    </td>
                                    <td>{item.Method}</td>
                                    <td style={{color: 'red'}}>{item.State}</td>
                                    <td>
                                        <div className="product-btn">
                                            <button 
                                                className="btn-edit" 
                                                onClick={() => handleAccept(item._id, item.State)}
                                                disabled={isReturned || isRefuse}
                                            >
                                                <FontAwesomeIcon icon={faCheck} />
                                            </button>
                                            <button 
                                                className="btn-delete"
                                                onClick={() => handleAccept(item._id, "Từ chối")}
                                                disabled={isLoaning || isReturned || isRefuse}
                                            >
                                                <FontAwesomeIcon icon={faXmark} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Trước
                </button>
                <span>Trang {currentPage} trên {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Sau
                </button>
            </div>
        </div>
    );
}
