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
    topic: existingProduct.Category?.Name || "",
    subcategory: existingProduct.Subcategory || "",
    tag: existingProduct.Tag || "",
    publisher: existingProduct.Publisher || "",
    publication_year: existingProduct.Publication_year || "",
    edition: existingProduct.Edition || "",
    summary: existingProduct.Summary || "",
    language: existingProduct.Language || "",
    state: existingProduct.Availability || "Available",
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
        setFormData((prev) => ({ ...prev, cover: reader.result }));
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await UpdateBookApi(existingProduct._id, formData);
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
          {/* ... các input trước ... */}

          <label htmlFor="state">
            <span>Trạng thái</span>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            >
              <option value="Available">✅ Có sẵn</option>
              <option value="Unavailable">🔴 Đang được mượn</option>
              <option value="Torned">⚠️ Bị hỏng</option>
            </select>
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

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="image-preview"
            />
          )}

          <input type="submit" value="Cập nhật sách" />
        </form>
      </div>
    </div>
  );
}