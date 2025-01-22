import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './productEdit.css';
import { UpdateBookApi } from "../../../api/book";

export default function ProductEdit() {
    const location = useLocation();
    const navigate = useNavigate();
    const existingProduct = location.state?.product || {};
    
    const [formData, setFormData] = useState({
        title: existingProduct.Title || "",
        author: existingProduct.Author || "",
        topic: existingProduct.Category.Name || "",
        subcategory: existingProduct.Subcategory || "",
        tag: existingProduct.Tag || "",
        publisher: existingProduct.Publisher || "",
        publication_year: existingProduct.Publication_year || "",
        edition: existingProduct.Edition || "",
        summary: existingProduct.Summary || "",
        language: existingProduct.Language || "",
        cover: existingProduct.Cover,
    });

    const [preview, setPreview] = useState(existingProduct.Cover);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    cover: reader.result, // Lưu base64 vào state
                });
                setPreview(reader.result); // Hiển thị ảnh preview
            };
            reader.readAsDataURL(file); // Chuyển file sang base64
        }
    };    

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await UpdateBookApi(existingProduct._id, formData); // Gửi formData trực tiếp dưới dạng JSON
            console.log("Cập nhật sách thành công:", response);
            alert("Thông tin sách đã được cập nhật!");
            navigate("/admin/product-management");
        } catch (error) {
            console.error("Lỗi khi cập nhật sách:", error);
            alert("Có lỗi xảy ra!");
        }
    };     

    return (
        <div className="product-container">
            <div className="product-body">
                <h1>Chỉnh sửa thông tin sách</h1>
                <form className="product-edit" onSubmit={handleSubmit}>
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
                        <input
                            type="text"
                            id="topic"
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            readOnly
                        />
                    </label>
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
                    {preview && <img src={preview} alt="Preview" className="image-preview" />}
                    <input type="submit" value="Cập nhật sách" />
                </form>
            </div>
        </div>
    );
}