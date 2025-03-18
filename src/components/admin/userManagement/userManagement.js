import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPenToSquare, faUserSlash, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { GetAllUserApi, UpdateUserStateApi } from "../../../api/account"; // Thêm API cập nhật trạng thái
import "./userManagement.css";

export default function UserManagement() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 8;
    const [searchInput, setSearchInput] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const users = await GetAllUserApi();
            if (users && Array.isArray(users.allUser)) {
                setData(users.allUser);
            } else {
                console.error("Dữ liệu không hợp lệ:", users);
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
        }
    };

    const handleChange = (e) => {
        setSearchInput(e.target.value);
        setCurrentPage(1);
    };

    const filteredData = data?.filter((item) => {
        const name = item.Name?.toLowerCase() ?? "";
        const email = item.Email?.toLowerCase() ?? "";
        const phone = item.Phone?.toLowerCase() ?? "";
        const cccd = item.CCCDNumber?.toLowerCase() ?? "";
        
        return (
            name.includes(searchInput.toLowerCase()) ||
            email.includes(searchInput.toLowerCase()) ||
            phone.includes(searchInput.toLowerCase()) ||
            cccd.includes(searchInput.toLowerCase()) 
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

    const handleUpdateState = async (id, newState) => {
        try {
            console.log(id);
            console.log(newState);
            await UpdateUserStateApi(id, newState);
            fetchData(); // Reload danh sách sau khi cập nhật trạng thái
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
        }
    };

    return (
        <div className="user-container">
            <div className="user-header">
                <h1>Quản lý tài khoản</h1>
                <div className="user-search">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <input
                        name="search"
                        placeholder="Nhập Tên/ Email/ Số điện thoại/ Số CCCD"
                        value={searchInput}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <table className="user-table">
                <thead>
                    <tr>
                        <th>Mã thẻ</th>
                        <th>Email</th>
                        <th>Tên</th>
                        <th>Giới tính</th>
                        <th>Tuổi</th>
                        <th>Số CCCD</th>
                        <th>Số điện thoại</th>
                        <th>Địa chỉ</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map((item, index) => (
                        <tr key={item.AccountID || index}>
                            <td>{item.LbCode}</td>
                            <td>{item.Email}</td>
                            <td>{item.Name}</td>
                            <td>{item.Gender}</td>
                            <td>{item.Age}</td>
                            <td>{item.CCCDNumber}</td>
                            <td>{item.Phone}</td>
                            <td>{item.Address}</td>
                            <td>{item.State}</td>
                            <td>
                                <div className="user-btn">
                                    {/* <button className="btn-edit" onClick={() => handleEdit(item)}>
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                    </button> */}
                                    {item.State !== "Limited" && (
                                        <button className="btn-limit" onClick={() => handleUpdateState(item._id, "limited")}>
                                            <FontAwesomeIcon icon={faUserSlash} /> Hạn chế
                                        </button>
                                    )}
                                    {item.State !== "UnActive" && (
                                        <button className="btn-block" onClick={() => handleUpdateState(item._id, "unActive")}>
                                            <FontAwesomeIcon icon={faUserSlash} /> Khóa
                                        </button>
                                    )}
                                    {item.State !== "Active" && (
                                        <button className="btn-unlock" onClick={() => handleUpdateState(item._id, "active")}>
                                            <FontAwesomeIcon icon={faUserCheck} /> Mở khóa
                                        </button>
                                    )}
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