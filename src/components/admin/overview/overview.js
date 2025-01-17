import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './overview.css';
import { totalBookApi, availableBookApi, topBorrowedBookApi, countBorrowedBookApi } from '../../../api/overview';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const Overview = () => {
  const data = {
    labels: ['Completed', 'Pending', 'Shipped', 'Returned'],
    datasets: [
      {
        data: [40, 20, 30, 10],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const [totalBook, setTotalBook] = useState("");
  const [availableBook, setAvailableBook] = useState("");
  const [topBook, setTopBook] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState(0);

  const [filterType, setFilterType] = useState("day"); // 'day', 'month', 'year'

  useEffect(() => {
    const fetchTotalBooks = async () => {
      try {
        const total = await totalBookApi();
        setTotalBook(total.totalBooks);
      } catch (error) {
        console.error("Error fetching total books:", error);
      }
    };

    const fetchAvailableBooks = async () => {
      try {
        const count = await availableBookApi();
        setAvailableBook(count.totalAvailableBooks);
      } catch (error) {
        console.error("Error fetching total available books:", error);
      }
    };

    const fetchTopBooks = async () => {
      try {
        const response = await topBorrowedBookApi();
        setTopBook(response.topBorrowedBooks || []);
      } catch (error) {
        console.error("Error fetching top borrowed books:", error);
      }
    };

    fetchTotalBooks();
    fetchAvailableBooks();
    fetchTopBooks();
  }, []);

  const handleCountBorrowedBooks = async (type) => {
    const today = new Date();
    let day = null, month = null, year = null;

    if (type === "day") {
      day = today.getDate();
      month = today.getMonth() + 1;
      year = today.getFullYear();
    } else if (type === "month") {
      month = today.getMonth() + 1;
      year = today.getFullYear();
    } else if (type === "year") {
      year = today.getFullYear();
    }

    try {
      const result = await countBorrowedBookApi(day, month, year);
      console.log(result);
      setBorrowedBooks(result.countBorrowedBooks);
    } catch (error) {
      console.error("Error fetching borrowed books count:", error);
    }
  };

  const handleFilterChange = (e) => {
    const selectedType = e.target.value;
    setFilterType(selectedType);
    handleCountBorrowedBooks(selectedType); // Gọi hàm ngay khi thay đổi
  };

  return (
    <div className="overview">
      <div className="stats-container">
        <div className="stat-card">
          <h3>Tổng số lượng sách</h3>
          <p>{totalBook}</p>
          <p>Quyển sách</p>
        </div>
        <div className="stat-card">
          <h3>Tổng số sách có thể cho mượn</h3>
          <p>{availableBook}</p>
          <p>Quyển sách</p>
        </div>
        <div className="stat-card">
          <h3>Số sách được mượn theo</h3>
          <div className="filter-container">
            <select
              value={filterType}
              onChange={handleFilterChange} // Gọi hàm khi thay đổi
            >
              <option value="day">Ngày</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </select>
          </div>
          <p>{borrowedBooks}</p>
          <p>Quyển sách</p>
        </div>
      </div>

      <div className="overview-content">
        <div className="top-products">
          <h3>Top sách được mượn nhiều</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Sách</th>
                <th>Số đơn mượn</th>
              </tr>
            </thead>
            <tbody>
              {topBook.length > 0 ? (
                topBook.map((item, index) => (
                  <tr key={item._id || index}>
                    <td>{index + 1}</td>
                    <td>{item.Title}</td>
                    <td>{item.CountBorrow}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="chart-container">
          <h3>Trạng thái đơn hàng</h3>
          <Pie data={data} />
        </div>
      </div>
    </div>
  );
};

export default Overview;