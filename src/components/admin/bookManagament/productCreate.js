import React, { useState } from "react"; 
import './productCreate.css';

export default function ProductCreate() {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        quantity: '',
        specialPrice: '',
        discount: '',
        description: '',
        image: null
    });
    const [preview, setPreview] = useState(null);

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
            // Tạo URL ảnh xem trước
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
        productData.append("image", formData.image);

        console.log("Product data submitted:", formData);
    };

    return (
        <div className="product-container">
            <div className="product-body">
                <h1>Danh sách sản phẩm/Thêm sản phẩm</h1>
                <form className="product-create" onSubmit={handleSubmit}>
                    <label htmlFor="name">
                        <span>Tên</span>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
                    </label>
                    <label htmlFor="price">
                        <span>Giá</span>
                        <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} min="0"/>
                    </label>
                    <label htmlFor="quantity">
                        <span>Số lượng</span>
                        <input type="number" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} min="0"/>
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
                    <input type="submit" value="Tạo" />
                </form>
            </div>
        </div>
    );
}
