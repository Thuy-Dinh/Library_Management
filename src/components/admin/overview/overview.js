import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './overview.css';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const Overview = () => {
  // Data for the pie chart
  const data = {
    labels: ['Completed', 'Pending', 'Shipped', 'Returned'],
    datasets: [
      {
        data: [40, 20, 30, 10],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return (
    <div className="overview">
      <div className="stats-container">
        <div className="stat-card">
          <h3>Doanh số tháng này</h3>
          <p>20</p>
          <p>40,700,000 đ</p>
        </div>
        <div className="stat-card">
          <h3>Doanh số hôm nay</h3>
          <p>1</p>
          <p>400,000 đ</p>
        </div>
        <div className="stat-card">
          <h3>Sản phẩm bán được trong tháng</h3>
          <p>70</p>
          <p>Sản phẩm</p>
        </div>
      </div>

      <div className='overview-content'>
        <div className="top-products">
            <h3>Top Sản Phẩm Bán Chạy</h3>
            <table>
            <thead>
                <tr>
                <th>#</th>
                <th>Sản phẩm</th>
                <th>Số lượng bán ra</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>1</td>
                <td>Giày Nike Revolution 6</td>
                <td>25</td>
                </tr>
                <tr>
                <td>2</td>
                <td>Giày Nike React Escape Run 2</td>
                <td>15</td>
                </tr>
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
