import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './productEdit.css';
import { UpdateBookApi, GetAllAreaApi } from "../../../api/book";

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
    area: existingProduct.Location.area || "", // Khu vực
    shelf: existingProduct.Location.shelf || "", // Kệ
    slot: existingProduct.Location.slot || "", // Tầng
  });

  const [preview, setPreview] = useState(existingProduct.Cover);
  const [areas, setAreas] = useState([]);
  const [shelves, setShelves] = useState(["A", "B", "C", "D"]);
  const [slots, setSlots] = useState([1, 2, 3, 4]);

  // Gọi API lấy dữ liệu khu vực
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await GetAllAreaApi();
        console.log("Dữ liệu khu vực:", response);
        setAreas(response.areas); // Giả sử response trả về { areas: [...] }
      } catch (error) {
        console.error("Lỗi khi lấy khu vực:", error);
      }
    };
    fetchAreas();
  }, []);

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
          <label htmlFor="area">
            <span>Khu vực</span>
            <select
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
            >
              {areas.length > 0 &&
                areas.map((area, index) => (
                  <option key={index} value={area}>
                    {area}
                  </option>
                ))}
            </select>
          </label>

          <label htmlFor="shelf">
            <span>Kệ</span>
            <select
              id="shelf"
              name="shelf"
              value={formData.shelf}
              onChange={handleChange}
              required
            >
              {shelves.map((shelf, index) => (
                <option key={index} value={shelf}>
                  {shelf}
                </option>
              ))}
            </select>
          </label>

          <label htmlFor="slot">
            <span>Tầng</span>
            <select
              id="slot"
              name="slot"
              value={formData.slot}
              onChange={handleChange}
              required
            >
              {slots.map((slot, index) => (
                <option key={index} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </label>
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