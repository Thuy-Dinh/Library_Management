import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement as BarEl
} from 'chart.js';
import './overview.css';
import {
  totalBookApi,
  availableBookApi,
  topBorrowedBookApi,
  countBorrowedBookApi,
  countDamagedBooksApi,
  borrowedByMonthApi
} from '../../../api/overview';

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarEl
);

const Overview = () => {
  const [totalBook, setTotalBook] = useState(0);
  const [availableBook, setAvailableBook] = useState(0);
  const [topBook, setTopBook] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState(0);
  const [damagedBooks, setDamagedBooks] = useState(0); // sửa tên đúng
  const [filterType, setFilterType] = useState('day');
  const [monthlyBorrowData, setMonthlyBorrowData] = useState(null);

  // Fetch totals and top books on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const total = await totalBookApi();
        setTotalBook(total.totalBooks);
      } catch (error) {
        console.error('Error fetching total books:', error);
      }

      try {
        const avail = await availableBookApi();
        setAvailableBook(avail.totalAvailableBooks);
      } catch (error) {
        console.error('Error fetching available books:', error);
      }

      try {
        const topRes = await topBorrowedBookApi();
        setTopBook(topRes.topBorrowedBooks || []);
      } catch (error) {
        console.error('Error fetching top borrowed books:', error);
      }

      try {
        const damaged = await countDamagedBooksApi(); // gọi API sách hỏng
        setDamagedBooks(damaged.damagedBooks);        // set state
      } catch (error) {
        console.error('Error fetching damaged books:', error);
      }

      handleCountBorrowedBooks(filterType);
      fetchMonthlyBorrowStats();
    };

    fetchStats();
  }, []);

  // Handle change in summary filter (day/month/year)
  const handleCountBorrowedBooks = async (type) => {
    const today = new Date();
    let day = null;
    let month = null;
    let year = null;
    if (type === 'day') {
      day = today.getDate();
      month = today.getMonth() + 1;
      year = today.getFullYear();
    } else if (type === 'month') {
      month = today.getMonth() + 1;
      year = today.getFullYear();
    } else if (type === 'year') {
      year = today.getFullYear();
    }
    try {
      const res = await countBorrowedBookApi(day, month, year);
      setBorrowedBooks(res.countBorrowedBooks);
    } catch (error) {
      console.error('Error fetching borrowed books count:', error);
    }
  };

  // Fetch monthly borrow statistics
  const fetchMonthlyBorrowStats = async () => {
    try {
      const year = new Date().getFullYear();
      const res = await borrowedByMonthApi(year);
      const { months, counts } = res;
      setMonthlyBorrowData({
        labels: months,
        datasets: [
          {
            label: 'Số lượt mượn sách',
            data: counts,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching monthly borrow stats:', error);
    }
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const type = e.target.value;
    setFilterType(type);
    handleCountBorrowedBooks(type);
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
          <h3>Tổng số sách bị hỏng hoặc mất</h3>
          <p>{damagedBooks}</p>
          <p>Quyển sách</p>
        </div>
        <div className="stat-card">
          <h3>Số sách được mượn theo</h3>
          <div className="filter-container">
            <select value={filterType} onChange={handleFilterChange}>
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

        {/* Biểu đồ mượn sách theo tháng */}
        {monthlyBorrowData && (
          <div className="chart-container">
            <h3>Biểu đồ mượn sách theo tháng (năm {new Date().getFullYear()})</h3>
            <Bar
              data={monthlyBorrowData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Số lượt mượn sách mỗi tháng' },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1, // ✅ Khoảng cách 1 đơn vị
                      callback: function (value) {
                        return Number.isInteger(value) ? value : null; // ✅ Chỉ hiển thị số nguyên
                      },
                    },
                  },
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;