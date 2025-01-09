import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";  // Để lấy tham số từ URL
import Navbar from "../HomePage/navbar";
import Header from "../HomePage/header";
import Footer from "../HomePage/footer";
import { GetAllTopicApi } from '../../api/book';

export default function SearchByCategory() {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Quản lý trạng thái đăng nhập
    const [userName, setUserName] = useState('');
    const [topics, setTopics] = useState([]); // Danh sách các chủ đề
    const [selectedTopics, setSelectedTopics] = useState([]); // Chủ đề đã được chọn

    // Lấy tham số từ URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const selectedCategory = queryParams.get('category'); // Lấy giá trị của category từ URL

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        const storedToken = localStorage.getItem('userToken');
        if (storedName && storedToken) {
            setIsAuthenticated(true);
            setUserName(storedName);
        } else {
            setIsAuthenticated(false);
        }

        // Lấy danh sách các chủ đề
        const fetchTopics = async () => {
            try {
                const response = await GetAllTopicApi(); // Lấy dữ liệu chủ đề từ API
                if (response.success) {
                    setTopics(response.data); // Lưu dữ liệu chủ đề
                    // Kiểm tra nếu chủ đề đã chọn từ URL thì tích vào ô checkbox
                    if (selectedCategory) {
                        setSelectedTopics([selectedCategory]);
                    }
                } else {
                    console.error("Failed to fetch topics:", response.message);
                }
            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        };
        fetchTopics();
    }, [selectedCategory]);  // Mỗi khi selectedCategory thay đổi, sẽ fetch lại dữ liệu

    // Hàm để cập nhật các chủ đề đã chọn
    const handleTopicChange = (e) => {
        const topicId = e.target.value;
        setSelectedTopics(prevState => 
            prevState.includes(topicId) 
            ? prevState.filter(id => id !== topicId) 
            : [...prevState, topicId]
        );
    };

    return (
        <div className="homepage-body">
            <Navbar isAuthenticated={isAuthenticated} userName={userName} setIsAuthenticated={setIsAuthenticated} />
            <Header />
            
            <div className="search-container">
                {/* Sidebar bên trái */}
                <div className="sidebar">
                    <h3>Chọn chủ đề</h3>
                    {topics.map((topic) => (
                        <div key={topic._id} className="topic-checkbox">
                            <input 
                                type="checkbox" 
                                value={topic._id} 
                                checked={selectedTopics.includes(topic.topic)} // Kiểm tra nếu chủ đề này được chọn
                                onChange={handleTopicChange} 
                            />
                            <label>{topic.topic}</label>
                        </div>
                    ))}
                </div>

                {/* Nội dung chính */}
                <div className="main-content">
                    <h2>Danh sách sách theo chủ đề</h2>
                    {/* Ở đây bạn có thể hiển thị các sách theo chủ đề đã chọn */}
                </div>
            </div>

            <Footer />
        </div>
    );
}