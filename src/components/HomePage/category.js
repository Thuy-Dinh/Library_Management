import React, { useState, useEffect } from 'react';
import './category.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Mousewheel, Keyboard } from 'swiper/modules';
import { useNavigate } from "react-router-dom";
import { GetAllTopicApi } from '../../api/book';

function Category() {
    const [categories, setCategories] = useState([]); // Quản lý danh sách thể loại
    const navigate = useNavigate();

    useEffect(() => {
        // Gọi API và lưu dữ liệu
        const fetchCategories = async () => {
            try {
                const response = await GetAllTopicApi(); // Gọi hàm API
                if (response.success) {
                    console.log(response.data);
                    setCategories(response.data); // Lưu dữ liệu trả về
                } else {
                    console.error("Failed to fetch categories:", response.message);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    // Hàm điều hướng khi nhấp vào thể loại
    const handleCategoryClick = (categoryName) => {
        navigate(`/search?category=${categoryName}`);  // Điều hướng đến trang tìm kiếm với tên chủ đề
    }

    return (
        <div className="category-list">
            <h2 className="categorys-title">Thể loại</h2>
            <h3 className="categorys-quiz">
                "Một cuốn sách hay cho ta một điều tốt, một người bạn tốt cho ta một điều hay."
            </h3>
            <h4>– La Rochefoucauld</h4>
            <div className="category-content">
                <Swiper
                    mousewheel={true}
                    keyboard={true}
                    spaceBetween={30}
                    slidesPerView={5}
                    modules={[Mousewheel, Keyboard]}
                >
                    {categories.map((category, index) => (
                        <SwiperSlide key={index}>
                            <h3 style={{ marginBottom: 15, whiteSpace: 'nowrap' }} onClick={() => handleCategoryClick(category.topic)}>
                                {category.topic} {/* Hiển thị tên chủ đề */}
                            </h3>
                            <div className="category-item" onClick={() => handleCategoryClick(category.topic)}>
                                {category.cover ? (
                                    <img 
                                        src={category.cover} 
                                        alt={category.topic} 
                                        className="book-cover" 
                                    />
                                ) : (
                                    <img 
                                        src="https://via.placeholder.com/150" 
                                        alt="Placeholder" 
                                        className="book-cover" 
                                    />
                                )}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}

export default Category;