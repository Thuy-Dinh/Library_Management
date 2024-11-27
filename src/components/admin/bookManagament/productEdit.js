import React, { useState, useEffect } from "react"; 
import { useLocation, useNavigate } from "react-router-dom";
import './productEdit.css';

export default function ProductEdit() {
    const location = useLocation();
    const navigate = useNavigate();
    const existingProduct = location.state?.product || {};
    
    const [formData, setFormData] = useState({
        name: existingProduct.name || '',
        price: existingProduct.price || '',
        quantity: existingProduct.quantity || '',
        specialPrice: existingProduct.specialPrice || '',
        discount: existingProduct.discount || '',
        description: existingProduct.description || '',
        image: null
    });

    const [preview, setPreview] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                image: file
            });
            if (preview) URL.revokeObjectURL(preview);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const productData = new FormData();
        productData.append("name", formData.name);
        productData.append("price", formData.price);
        productData.append("quantity", formData.quantity);
        productData.append("specialPrice", formData.specialPrice);
        productData.append("discount", formData.discount);
        productData.append("description", formData.description);
        if (formData.image) productData.append("image", formData.image);

        console.log("Product data submitted:", formData);

        setSubmitted(true);

        // setTimeout(() => navigate("/product-management"), 2000);
    };

    return (
        <div className="product-container">
            <div className="product-body">
                <h1>Danh sách sản phẩm/Chỉnh sửa thông tin sản phẩm</h1>
                <form className="product-edit" onSubmit={handleSubmit}>
                    <label htmlFor="name">
                        <span>Tên</span>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </label>
                    <label htmlFor="price">
                        <span>Giá</span>
                        <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} min="0" required />
                    </label>
                    <label htmlFor="quantity">
                        <span>Số lượng</span>
                        <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} min="0" required />
                    </label>
                    <label htmlFor="specialPrice">
                        <span>Giá ưu đãi</span>
                        <input type="number" id="specialPrice" name="specialPrice" value={formData.specialPrice} onChange={handleChange} min="0"/>
                    </label>
                    <label htmlFor="discount">
                        <span>Giảm giá (%)</span>
                        <input type="number" id="discount" name="discount" value={formData.discount} onChange={handleChange} min="0"/>
                    </label>
                    <label htmlFor="description">
                        <span>Mô tả</span>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} />
                    </label>
                    <label htmlFor="image">
                        <span>Ảnh minh họa</span>
                        <input type="file" id="image" name="image" onChange={handleImageChange} />
                    </label>
                    {preview && <img src={preview} alt="Preview" className="image-preview" />}
                    <input type="submit" value="Chỉnh sửa" />
                </form>
                {/* {submitted && <p className="submission-message">Thông tin sản phẩm đã được gửi thành công! Đang quay lại danh sách...</p>} */}
            </div>
        </div>
    );
}
