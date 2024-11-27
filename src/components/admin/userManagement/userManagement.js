import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { GetAllUserApi } from "../../../api/account";
import "./userManagement.css";

export default function UserManagement() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const [searchInput, setSearchInput] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const users = await GetAllUserApi();
                if (users && Array.isArray(users.allUser)) {
                    setData(users.allUser);  // Chỉ set data nếu là mảng hợp lệ
                } else {
                    console.error("Dữ liệu không hợp lệ:", users);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };
        fetchData();
    }, []);    

    const handleChange = (e) => {
        setSearchInput(e.target.value);
        setCurrentPage(1);
    };

    const filteredData = data?.filter((item) => {
        const name = item.Name?.toLowerCase() ?? "";
        const email = item.Email?.toLowerCase() ?? "";
        const phone = item.Phone?.toLowerCase() ?? "";
        
        return (
            name.includes(searchInput.toLowerCase()) ||
            email.includes(searchInput.toLowerCase()) ||
            phone.includes(searchInput.toLowerCase())
        );
    }) || [];      

    const totalPages = filteredData.length > 0 ? Math.ceil(filteredData.length / recordsPerPage) : 1;

    const indexOfLastRecord = currentPage * recordsPerPage;
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

    const handleEdit = (user) => {
        navigate("/admin/user-management/user-edit", { state: { user } });
    };

    return (
        <div className="user-container">
            <div className="user-header">
                <h1>Quản lý tài khoản</h1>
                <div className="user-search">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <input
                        name="search"
                        placeholder="Nhập Tên/ Email/ Số điện thoại"
                        value={searchInput}
                        onChange={handleChange}
                    />
                </div>
                <Link to="/admin/user-management/user-create" className="btn-add">Thêm tài khoản</Link>
            </div>

            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Tên</th>
                        <th>Giới tính</th>
                        <th>Tuổi</th>
                        <th>Số điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map((item) => (
                        <tr key={item.id}>
                            <td>{item.AccountID}</td>
                            <td>{item.Email}</td>
                            <td>{item.Name}</td>
                            <td>{item.Gender}</td>
                            <td>{item.Age}</td>
                            <td>{item.Phone}</td>
                            <td>{item.Address}</td>
                            <td>
                                <div className="user-btn">
                                    <button className="btn-edit" onClick={() => handleEdit(item)}>
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                    </button>
                                    <button className="btn-delete">
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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