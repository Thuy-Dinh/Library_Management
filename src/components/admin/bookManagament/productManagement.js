import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCirclePlus, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import './productManagement.css';
import { GetAllBookApi } from "../../../api/book";

export default function ProductManagement() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 4;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const books = await GetAllBookApi();
                console.log(books);
                if (books && Array.isArray(books.data)) {
                    setData(books.data);  // Chỉ set data nếu là mảng hợp lệ
                } else {
                    console.error("Dữ liệu không hợp lệ:", books);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };
        fetchData();
    }, []); 

    const [searchInput, setSearchInput] = useState("");

    const handleChange = (e) => {
        setSearchInput(e.target.value);
        setCurrentPage(1); 
    };

    const filteredData = data?.filter((item) => {
        const title = item.Title?.toLowerCase() ?? "";
        
        return (
            title.includes(searchInput.toLowerCase())
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

    const handleEdit = (product) => {
        navigate("/admin/product-management/product-edit", { state: { product } });
    };

    return (
        <div className="product-container">
            <div className="product-body">
                <div className="product-header">
                    <h1>Danh sách sách</h1>
                    <div className="product-content">
                        <div className="product-search">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                            <input
                                name="search"
                                placeholder="Tìm kiếm sách theo tên..."
                                value={searchInput}
                                onChange={handleChange}
                            />
                        </div>
                        <Link to="/admin/product-management/product-create" className="btn-add">
                            <FontAwesomeIcon icon={faCirclePlus} />
                            <span>Thêm sách</span>
                        </Link>
                    </div>   
                </div>
                
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Topic</th>
                            <th>Subcaterory</th>
                            <th>Edition</th>
                            <th>Availability</th>
                            <th>Mượn (lần)</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.map((item) => (
                            <tr key={item.BookID}>
                                <td>{item.BookID}</td>
                                <td>{item.Title}</td>
                                <td>{item.Author}</td>
                                <td>{item.Topic}</td>
                                <td>{item.Subcaterory}</td>
                                <td>{item.Edition}</td>
                                <td>{item.Availability}</td>
                                <td>{item.CountBorrow}</td>
                                <td>
                                    <div className="product-btn">
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
