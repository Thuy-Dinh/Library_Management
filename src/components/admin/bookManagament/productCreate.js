import React, { useState, useEffect } from "react";
import "./productCreate.css";
import { useNavigate } from "react-router-dom";
import {
  CreateBookApi,
  GetAllTopicApi,
  CreateTopicApi,
  GetAllAreaApi
} from "../../../api/book";

const convertToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onloadend = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
  reader.readAsDataURL(file);
});

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
    area: "",   // khu vực
    shelf: "",  // kệ
    slot: "",   // tầng
    price: ""   // giá
  });

  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [topics, setTopics] = useState([]);
  const [isNewTopic, setIsNewTopic] = useState(false);
  const [newTopic, setNewTopic] = useState("");

  const [areas, setAreas] = useState([]);  // danh sách khu vực
  const [selectedArea, setSelectedArea] = useState("");  // khu vực được chọn

  // Lấy topics & areas
  useEffect(() => {
    (async () => {
      try {
        const tRes = await GetAllTopicApi();
        setTopics(tRes.data || []);
      } catch (e) {
        console.error("Lỗi khi lấy chủ đề:", e);
      }
      try {
        const aRes = await GetAllAreaApi();
        setAreas(aRes.areas || []);
      } catch (e) {
        console.error("Lỗi khi lấy khu vực:", e);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
  };

  const handleTopicChange = (e) => {
    const topicName = e.target.value;
  
    if (topicName === "new") {
      setIsNewTopic(true);
      setFormData(fd => ({ ...fd, topic: "", area: "" }));
      setSelectedArea(""); // reset khu vực khi tạo chủ đề mới
    } else {
      setIsNewTopic(false);
  
      // Cập nhật chủ đề và khu vực khi chọn chủ đề
      const selectedTopic = topics.find(topic => topic.topic === topicName);
      if (selectedTopic) {  
        const topicId = selectedTopic.id;
        const foundArea = areas.find(area =>
          area.Topics.some(topic => topic._id === topicId)
        );
  
        setFormData(fd => ({
          ...fd,
          topic: selectedTopic.topic, // Lưu tên chủ đề thay vì ID
          area: foundArea ? foundArea.Name : ""
        }));
        setSelectedArea(foundArea ? foundArea.Name : "");  // Cập nhật khu vực đã chọn
      } else {
        console.error("Chủ đề không tồn tại trong danh sách topics");
      }
    }
  };  

  const handleAreaChange = (e) => {
    setFormData(fd => ({ ...fd, area: e.target.value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsLoading(true);
    try {
      const b64 = await convertToBase64(file);
      setFormData(fd => ({ ...fd, cover: b64 }));
      setPreview(URL.createObjectURL(file));
    } catch (e) {
      console.error("Lỗi chuyển ảnh:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let topicToSubmit = formData.topic;
      if (isNewTopic && newTopic.trim()) {
        const exists = topics.some(t => t.topic.toLowerCase() === newTopic.trim().toLowerCase());
        if (exists) {
          alert("Chủ đề đã tồn tại, vui lòng chọn danh sách.");
          return;
        }
        const nt = await CreateTopicApi({ topic: newTopic });
        topicToSubmit = nt.data.Name;
      }

      // Gửi payload gồm cả area, shelf, slot và price
      const payload = {
        ...formData,
        topic: topicToSubmit
      };
      await CreateBookApi(payload);
      alert("Tạo sách thành công!");
      navigate("/admin/product-management");
    } catch (error) {
      console.error("Lỗi khi tạo sách:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <div className="product-container">
      <div className="product-body">
        <h1>Thêm Sách</h1>
        <form className="product-create" onSubmit={handleSubmit}>
          {/* Tiêu đề, tác giả */}
          <label><span>Tiêu đề</span>
            <input name="title" value={formData.title} onChange={handleChange} required />
          </label>
          <label><span>Tác giả</span>
            <input name="author" value={formData.author} onChange={handleChange} required />
          </label>

          {/* Chủ đề */}
          <label><span>Chủ đề</span>
            <select name="topic" value={formData.topic} onChange={handleTopicChange}>
              <option value="">Chọn chủ đề</option>
              {topics.map(t => (
                <option key={t._id} value={t._id}>{t.topic}</option>
              ))}
              <option value="new">Tạo chủ đề mới</option>
            </select>
          </label>
          {isNewTopic && (
            <label><span>Chủ đề mới</span>
              <input value={newTopic} onChange={e => setNewTopic(e.target.value)} required />
            </label>
          )}

          {/* Phân loại phụ, thẻ, NXB, năm XB,... */}
          <label><span>Phân loại phụ</span>
            <input name="subcategory" value={formData.subcategory} onChange={handleChange} />
          </label>
          <label><span>Thẻ</span>
            <input name="tag" value={formData.tag} onChange={handleChange} />
          </label>
          <label><span>Nhà xuất bản</span>
            <input name="publisher" value={formData.publisher} onChange={handleChange} />
          </label>
          <label><span>Năm XB</span>
            <input type="number" name="publication_year"
              value={formData.publication_year}
              onChange={handleChange} min="0" />
          </label>
          <label><span>Edition</span>
            <input name="edition" value={formData.edition} onChange={handleChange} />
          </label>
          <label><span>Tóm tắt</span>
            <textarea name="summary" value={formData.summary} onChange={handleChange} />
          </label>
          <label><span>Ngôn ngữ</span>
            <input name="language" value={formData.language} onChange={handleChange} />
          </label>

          {/* ==== Vị trí: khu vực, kệ, tầng ==== */}
          {isNewTopic ? (
            // Nếu chọn tạo chủ đề mới, cho phép chọn khu vực
            <label><span>Khu vực</span>
              <select
                name="area"
                value={formData.area}
                onChange={handleAreaChange}
                required
              >
                <option value="">Chọn khu vực</option>
                {areas.map((area) => (
                  <option key={area._id} value={area.Name}>{area.Name}</option>
                ))}
              </select>
            </label>
          ) : (
            // Nếu chọn chủ đề có sẵn, chỉ hiển thị khu vực của chủ đề đã chọn
            <label><span>Khu vực</span>
              <input
                type="text"
                name="area"
                value={selectedArea}
                readOnly
              />
            </label>
          )}

          <label><span>Kệ</span>
            <select
              name="shelf"
              value={formData.shelf}
              onChange={handleChange}
              required
            >
              <option value="">Chọn kệ</option>
              {["A","B","C","D"].map(s => (
                <option key={s} value={s}>Kệ {s}</option>
              ))}
            </select>
          </label>

          <label><span>Tầng</span>
            <select
              name="slot"
              value={formData.slot}
              onChange={handleChange}
              required
            >
              <option value="">Chọn tầng</option>
              {[1,2,3,4].map(n => (
                <option key={n} value={n}>Tầng {n}</option>
              ))}
            </select>
          </label>
          {/* ==== End Vị trí ==== */}

          {/* ==== Giá ==== */}
          <label><span>Giá</span>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              required
            />
          </label>

          {/* Ảnh bìa */}
          <label><span>Ảnh bìa</span>
            <input type="file" name="cover" onChange={handleImageChange} />
          </label>
          {isLoading && <p>Đang tải ảnh...</p>}
          {preview && <img src={preview} alt="Preview" className="image-preview-book" />}

          <input type="submit" value="Tạo sách" />
        </form>
      </div>
    </div>
  );
}

  