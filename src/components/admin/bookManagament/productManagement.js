import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import './productManagement.css';
import { GetAllBookApi, DeleteBookApi } from "../../../api/book";

export default function ProductManagement() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const navigate = useNavigate();

  // filter / search state
  const [searchCode, setSearchCode] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchAuthor, setSearchAuthor] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [searchAvailability, setSearchAvailability] = useState("");
  const [searchPublisher, setSearchPublisher] = useState("");
  const [searchYear, setSearchYear] = useState("");
  const [searchArea, setSearchArea] = useState("");
  const [searchShelf, setSearchShelf] = useState("");
  const [searchSlot, setSearchSlot] = useState("");

  const [sortField, setSortField] = useState("Title");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const books = await GetAllBookApi();
        if (books && Array.isArray(books.data)) {
          setData(books.data);
        } else {
          console.error("Dữ liệu không hợp lệ:", books);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  const uniqueAreas = [...new Set(data.map(item => item.Location?.area).filter(Boolean))];

  const filteredData = data.filter(item => {
    const code = item.BookCode?.toLowerCase() ?? "";
    const title = item.Title?.toLowerCase() ?? "";
    const author = item.Author?.toLowerCase() ?? "";
    const category = item.Category?.Name?.toLowerCase() ?? "";
    const availability = item.Availability ?? "";
    const publisher = item.Publisher?.toLowerCase() ?? "";
    const year = item.Publication_year?.toString() ?? "";
    const area = item.Location?.area?.toLowerCase() ?? "";
    const shelf = item.Location?.shelf?.toLowerCase() ?? "";
    const slot = item.Location?.slot?.toString() ?? "";

    return (
      code.includes(searchCode.toLowerCase()) &&
      title.includes(searchTitle.toLowerCase()) &&
      author.includes(searchAuthor.toLowerCase()) &&
      category.includes(searchCategory.toLowerCase()) &&
      availability.includes(searchAvailability) &&
      publisher.includes(searchPublisher.toLowerCase()) &&
      year.includes(searchYear) &&
      (area.includes(searchArea.toLowerCase()) || searchArea === "") &&
      (shelf.includes(searchShelf.toLowerCase()) || searchShelf === "") &&
      (slot.includes(searchSlot) || searchSlot === "")
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === "Favorites") {
      valA = a.Rating || 0;
      valB = b.Rating || 0;
    }

    if (typeof valA === "string") return valA.localeCompare(valB);
    return valA - valB;
  });

  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const indexOfLastRecord = currentPage > totalPages ? recordsPerPage : currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = sortedData.slice(indexOfFirstRecord, indexOfLastRecord);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handleEdit = product => {
    navigate("/admin/product-management/edit", { state: { product } });
  };

  const handleDel = async bookID => {
    if (!window.confirm("Bạn có chắc muốn xóa sách này?")) return;
    try {
      await DeleteBookApi(bookID);
      const books = await GetAllBookApi();
      if (books && Array.isArray(books.data)) {
        setData(books.data);
      }
    } catch (error) {
      console.error("Lỗi khi xóa sách:", error);
    }
  };

  const handleDetail = id => {
    navigate(`/admin/product-management/detail?id=${id}`);
  };

  return (
    <div className="product-container">
      <div className="product-body">
        <div className="product-header">
          <h1>Danh sách sách</h1>
          <Link to="/admin/product-management/create" className="btn-add">
            <FontAwesomeIcon icon={faCirclePlus} />
            <span>Thêm sách</span>
          </Link>
        </div>

        <div className="search-fields">
          <div className="field">
            <label>Mã sách</label>
            <input
              value={searchCode}
              onChange={e => setSearchCode(e.target.value)}
              placeholder="Nhập mã sách"
            />
          </div>
          <div className="field">
            <label>Tiêu đề</label>
            <input
              value={searchTitle}
              onChange={e => setSearchTitle(e.target.value)}
              placeholder="Nhập tiêu đề"
            />
          </div>
          <div className="field">
            <label>Tác giả</label>
            <input
              value={searchAuthor}
              onChange={e => setSearchAuthor(e.target.value)}
              placeholder="Nhập tác giả"
            />
          </div>
          <div className="field">
            <label>Chủ đề</label>
            <input
              value={searchCategory}
              onChange={e => setSearchCategory(e.target.value)}
              placeholder="Nhập chủ đề"
            />
          </div>

          {/* Vị trí */}
          <div className="field">
            <label>Khu vực</label>
            <select value={searchArea} onChange={e => setSearchArea(e.target.value)}>
              <option value="">Tất cả</option>
              {uniqueAreas.map((area, idx) => (
                <option key={idx} value={area}>
                  Khu {area}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Kệ</label>
            <select value={searchShelf} onChange={e => setSearchShelf(e.target.value)}>
              <option value="">Tất cả</option>
              <option value="A">Kệ A</option>
              <option value="B">Kệ B</option>
              <option value="C">Kệ C</option>
              <option value="D">Kệ D</option>
            </select>
          </div>
          <div className="field">
            <label>Tầng</label>
            <select value={searchSlot} onChange={e => setSearchSlot(e.target.value)}>
              <option value="">Tất cả</option>
              <option value="1">Tầng 1</option>
              <option value="2">Tầng 2</option>
              <option value="3">Tầng 3</option>
              <option value="4">Tầng 4</option>
            </select>
          </div>

          <div className="field">
            <label>Trạng thái</label>
            <select
              value={searchAvailability}
              onChange={e => setSearchAvailability(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="Available">Có sẵn</option>
              <option value="Unavailable">Đang được mượn</option>
              <option value="Torned">Hỏng</option>
            </select>
          </div>
          <div className="field">
            <label>Nhà xuất bản</label>
            <input
              value={searchPublisher}
              onChange={e => setSearchPublisher(e.target.value)}
              placeholder="Nhập NXB"
            />
          </div>
          <div className="field">
            <label>Năm xuất bản</label>
            <input
              type="number"
              value={searchYear}
              onChange={e => setSearchYear(e.target.value)}
              placeholder="VD: 2020"
            />
          </div>
          <div className="field">
            <label>Sắp xếp theo</label>
            <select value={sortField} onChange={e => setSortField(e.target.value)}>
              <option value="Title">Tiêu đề</option>
              <option value="Author">Tác giả</option>
              <option value="Price">Giá</option>
              <option value="Favorites">Yêu thích</option>
            </select>
          </div>
        </div>

        <table className="product-table">
          <thead>
            <tr>
              <th>Mã sách</th>
              <th>Tiêu đề</th>
              <th>Tác giả</th>
              <th>Chủ đề</th>
              <th>NXB</th>
              <th>Năm XB</th>
              <th>Giá</th>
              <th>Đánh giá</th>
              <th>Vị trí</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map(item => (
              <tr key={item.BookID}>
                <td>{item.BookCode}</td>
                <td
                  style={{ cursor: 'pointer' }} 
                  onClick={() => handleDetail(item._id)}
                >
                  {item.Title}
                </td>
                <td>{item.Author}</td>
                <td>{item.Category?.Name}</td>
                <td>{item.Publisher}</td>
                <td>{item.Publication_year}</td>
                <td>{item.Price}</td>
                <td>{item.Rating}</td>
                <td style={{ minWidth: 120 }}>
                  Khu {item.Location?.area}, kệ {item.Location?.shelf}, tầng {item.Location?.slot}
                </td>
                <td style={{
                  color:
                    item.Availability === "Available" ? "green" :
                    item.Availability === "Unavailable" ? "red" :
                    "orange"
                }}>
                  {item.Availability === "Available"
                    ? "✅ Có sẵn"
                    : item.Availability === "Unavailable"
                      ? "🔴 Đang được mượn"
                      : "⚠️ Hỏng"}
                </td>
                <td>
                  <div className="product-btn">
                    <button className="btn-edit" onClick={() => handleEdit(item)}>
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button className="btn-delete" onClick={() => handleDel(item._id)}>
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
            Trang trước
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
}