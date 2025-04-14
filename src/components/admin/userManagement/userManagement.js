import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faUserSlash, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { GetAllUserApi, UpdateUserStateApi } from "../../../api/account";
import "./userManagement.css";

export default function UserManagement() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 8;

    const [searchFields, setSearchFields] = useState({
        lbcode: "",
        name: "",
        email: "",
        phone: "",
        cccd: ""
    });    

    // Lọc theo trạng thái
    const [searchStatus, setSearchStatus] = useState("Tất cả");

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

    const handleSearchChange = (field, value) => {
        setSearchFields((prev) => ({
            ...prev,
            [field]: value
        }));
        setCurrentPage(1);
    };

    const filteredData = data?.filter((item) => {
        const lbcode = item.LbCode?.toLowerCase() ?? "";
        const name = item.Name?.toLowerCase() ?? "";
        const email = item.Email?.toLowerCase() ?? "";
        const phone = item.Phone?.toLowerCase() ?? "";
        const cccd = item.CCCDNumber?.toLowerCase() ?? "";
        const status = item.State ?? "";

        return (
            lbcode.includes(searchFields.lbcode.toLowerCase()) &&
            name.includes(searchFields.name.toLowerCase()) &&
            email.includes(searchFields.email.toLowerCase()) &&
            phone.includes(searchFields.phone.toLowerCase()) &&
            cccd.includes(searchFields.cccd.toLowerCase()) &&
            (searchStatus === "Tất cả" || status === searchStatus)
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
            await UpdateUserStateApi(id, newState);
            fetchData();
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
        }
    };

    return (
        <div className="user-container">
            <div className="user-header">
                <h1>Quản lý tài khoản</h1>
                <div className="user-search-group">
                    <div className="user-search">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                        <input
                            placeholder="Tìm theo tên"
                            value={searchFields.name}
                            onChange={(e) => handleSearchChange("name", e.target.value)}
                        />
                    </div>
                    <div className="user-search">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                        <input
                            placeholder="Tìm theo email"
                            value={searchFields.email}
                            onChange={(e) => handleSearchChange("email", e.target.value)}
                        />
                    </div>
                    <div className="user-search">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                        <input
                            placeholder="Tìm theo số điện thoại"
                            value={searchFields.phone}
                            onChange={(e) => handleSearchChange("phone", e.target.value)}
                        />
                    </div>
                    <div className="user-search">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                        <input
                            placeholder="Tìm theo CCCD"
                            value={searchFields.cccd}
                            onChange={(e) => handleSearchChange("cccd", e.target.value)}
                        />
                    </div>

                    <div className="user-search">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                        <input
                            placeholder="Tìm theo mã thẻ"
                            value={searchFields.lbcode}
                            onChange={(e) => handleSearchChange("lbcode", e.target.value)}
                        />
                    </div>

                    <div className="user-search">
                        <select
                            value={searchStatus}
                            onChange={(e) => {
                                setSearchStatus(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="Tất cả">Tất cả trạng thái</option>
                            <option value="Active">Hoạt động</option>
                            <option value="Limited">Hạn chế</option>
                            <option value="UnActive">Bị khóa</option>
                        </select>
                    </div>
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
                <button onClick={handlePrevPage} disabled={currentPage === 1}>Trước</button>
                <span>Trang {currentPage} trên {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>Sau</button>
            </div>
        </div>
    );
}