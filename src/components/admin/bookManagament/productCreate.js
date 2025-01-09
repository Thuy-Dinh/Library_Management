import React, { useState, useEffect } from "react";
import "./productCreate.css";
import { useNavigate } from "react-router-dom";
import { createBookApi, GetAllTopicApi, createTopicApi } from "../../../api/book";

const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

export default function ProductCreate() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        topic: "",
        subcategory: "",
        tag: "",
        publisher: "",
        publication_year: "",
        edition: "",
        summary: "",
        language: "",
        cover: null,
    });
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [topics, setTopics] = useState([]); // Danh sách các topics
    const [isNewTopic, setIsNewTopic] = useState(false); // Trạng thái tạo chủ đề mới
    const [newTopic, setNewTopic] = useState(""); // Chủ đề mới

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await GetAllTopicApi(); // API lấy danh sách các topics
                setTopics(response.data); // Giả sử response.data là danh sách các topics
            } catch (error) {
                console.error("Lỗi khi lấy danh sách chủ đề:", error);
            }
        };
        fetchTopics();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleTopicChange = (e) => {
        const value = e.target.value;
        if (value === "new") {
            setIsNewTopic(true);  // Hiển thị ô nhập chủ đề mới
            setFormData({ ...formData, topic: "" });  // Đặt giá trị topic trống khi tạo chủ đề mới
        } else {
            setIsNewTopic(false);  // Ẩn ô nhập chủ đề mới
            setFormData({ ...formData, topic: value });  // Lưu ID của chủ đề chọn
        }
    };       

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsLoading(true);
            try {
                const base64Image = await convertToBase64(file);
                setFormData({
                    ...formData,
                    cover: base64Image,
                });
                setPreview(URL.createObjectURL(file));
            } catch (error) {
                console.error("Lỗi khi chuyển đổi ảnh:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            let topicToSubmit = formData.topic; // Lấy giá trị chủ đề từ formData
    
            if (isNewTopic && newTopic.trim()) {
                // Kiểm tra nếu chủ đề mới đã tồn tại trong danh sách các chủ đề
                const topicExists = topics.some(topic => topic.topic.toLowerCase() === newTopic.trim().toLowerCase());
    
                if (topicExists) {
                    alert("Chủ đề này đã tồn tại. Vui lòng chọn trong danh sách chủ đề.");
                    return; // Dừng việc tạo sách
                }
    
                // Nếu chủ đề mới không trùng với chủ đề cũ, gọi API tạo chủ đề mới
                const newTopicResponse = await createTopicApi({ topic: newTopic });
                topicToSubmit = newTopicResponse.data; // Lấy ID của chủ đề mới
            }
    
            // Gọi API tạo sách với chủ đề đã chọn
            const response = await createBookApi(
                formData.title,
                formData.author,
                topicToSubmit.Name, // Lưu ý truyền đúng dữ liệu cho chủ đề
                formData.subcategory,
                formData.tag,
                formData.publisher,
                formData.publication_year,
                formData.edition,
                formData.summary,
                formData.language,
                formData.cover
            );
    
            console.log("Tạo sách thành công:", response);
            alert("Tạo sách thành công!");
            navigate("/admin/product-management");
    
        } catch (error) {
            console.error("Lỗi khi tạo sách hoặc chủ đề:", error);
            alert("Có lỗi xảy ra!");
        }
    };          

    return (
        <div className="product-container">
            <div className="product-body">
                <h1>Thêm Sách</h1>
                <form className="product-create" onSubmit={handleSubmit}>
                    <label htmlFor="title">
                        <span>Tiêu đề</span>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label htmlFor="author">
                        <span>Tác giả</span>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label htmlFor="topic">
                        <span>Chủ đề</span>
                        <select
                            id="topic"
                            name="topic"
                            value={formData.topic}
                            onChange={handleTopicChange}
                        >
                            <option value="">Chọn chủ đề</option>
                            {topics.map((topic) => (
                                <option key={topic._id} value={topic._id}>
                                    {topic.topic}
                                </option>
                            ))}
                            <option value="new">Tạo chủ đề mới</option>
                        </select>
                    </label>
                    {isNewTopic && (
                        <label htmlFor="newTopic">
                            <span>Nhập chủ đề mới</span>
                            <input
                                type="text"
                                id="newTopic"
                                value={newTopic}
                                onChange={(e) => setNewTopic(e.target.value)}
                                placeholder="Nhập chủ đề mới"
                                required
                            />
                        </label>
                    )}
                    <label htmlFor="subcategory">
                        <span>Phân loại phụ</span>
                        <input
                            type="text"
                            id="subcategory"
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={handleChange}
                        />
                    </label>
                    <label htmlFor="tag">
                        <span>Thẻ</span>
                        <input
                            type="text"
                            id="tag"
                            name="tag"
                            value={formData.tag}
                            onChange={handleChange}
                        />
                    </label>
                    <label htmlFor="publisher">
                        <span>Nhà xuất bản</span>
                        <input
                            type="text"
                            id="publisher"
                            name="publisher"
                            value={formData.publisher}
                            onChange={handleChange}
                        />
                    </label>
                    <label htmlFor="publication_year">
                        <span>Năm xuất bản</span>
                        <input
                            type="number"
                            id="publication_year"
                            name="publication_year"
                            value={formData.publication_year}
                            onChange={handleChange}
                            min="0"
                        />
                    </label>
                    <label htmlFor="edition">
                        <span>Phiên bản</span>
                        <input
                            type="text"
                            id="edition"
                            name="edition"
                            value={formData.edition}
                            onChange={handleChange}
                        />
                    </label>
                    <label htmlFor="summary">
                        <span>Tóm tắt</span>
                        <textarea
                            id="summary"
                            name="summary"
                            value={formData.summary}
                            onChange={handleChange}
                        ></textarea>
                    </label>
                    <label htmlFor="language">
                        <span>Ngôn ngữ</span>
                        <input
                            type="text"
                            id="language"
                            name="language"
                            value={formData.language}
                            onChange={handleChange}
                        />
                    </label>
                    <label htmlFor="cover">
                        <span>Ảnh bìa</span>
                        <input
                            type="file"
                            id="cover"
                            name="cover"
                            onChange={handleImageChange}
                        />
                    </label>
                    {isLoading && <p>Đang tải ảnh...</p>}
                    {preview && <img src={preview} alt="Preview" className="image-preview-book" />}
                    <input type="submit" value="Tạo sách" />
                </form>
            </div>
        </div>
    );
}