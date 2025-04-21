import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getALoanApi, updateLoanApi } from "../../../api/loan";
import "./loanEdit.css";

export default function LoanEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loan, setLoan] = useState(null);
    const [formData, setFormData] = useState({
        DayStart: "",
        DayEnd: "",
        State: "",
        Note: "",
        Payment: 0,
        Method: ""
    });

    useEffect(() => {
        const fetchLoan = async () => {
            try {
                const detail = await getALoanApi(id);
                const data = detail.loanDetail;
                setLoan(data);
                setFormData({
                    DayStart: data.DayStart?.slice(0, 10),
                    DayEnd: data.DayEnd?.slice(0, 10),
                    State: data.State,
                    Note: data.Note || "",
                    // Tách phần số từ "100000 VND" hoặc chuỗi tương tự
                    Payment: parseInt(data.Payment) || 0,
                    Method: data.Method,
                });
            } catch (error) {
                console.error("Lỗi khi load dữ liệu đơn:", error);
            }
        };
        fetchLoan();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Khi cập nhật, nếu cần bổ sung lại đơn vị, có thể thực hiện ở đây
            const payload = {
                ...formData,
                Payment: formData.Payment + " VND"
            };
            await updateLoanApi(id, payload);
            alert("✅ Cập nhật đơn thành công!");
            navigate(`/admin/order-management/order-detail/${id}`);
        } catch (error) {
            console.error("❌ Lỗi cập nhật:", error);
            alert("Đã xảy ra lỗi khi cập nhật.");
        }
    };

    if (!loan) return <p>Đang tải dữ liệu...</p>;

    return (
        <div className="edit-loan-container">
            <h2>Chỉnh sửa đơn mượn</h2>
            <form onSubmit={handleSubmit} className="edit-loan-form">
                <label>
                    Ngày mượn:
                    <input
                        type="date"
                        name="DayStart"
                        value={formData.DayStart}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Hạn trả:
                    <input
                        type="date"
                        name="DayEnd"
                        value={formData.DayEnd}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Trạng thái:
                    <select
                        name="State"
                        value={formData.State}
                        onChange={handleChange}
                    >
                        <option value="Đang mượn">Đang mượn</option>
                        <option value="Đã trả">Đã trả</option>
                        <option value="Quá hạn">Quá hạn</option>
                    </select>
                </label>

                <label>
                    Hình thức mượn:
                    <select
                        name="Method"
                        value={formData.Method}
                        onChange={handleChange}
                    >
                        <option value="Tại chỗ">Tại chỗ</option>
                        <option value="Về nhà">Về nhà</option>
                    </select>
                </label>

                <label>
                    Tiền cọc:
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                            type="number"
                            name="Payment"
                            value={formData.Payment}
                            onChange={handleChange}
                            style={{ marginRight: "8px" }}
                        />
                        <span>VNĐ</span>
                    </div>
                </label>

                <label>
                    Ghi chú:
                    <textarea
                        name="Note"
                        value={formData.Note}
                        onChange={handleChange}
                    ></textarea>
                </label>

                <button type="submit">💾 Lưu thay đổi</button>
            </form>
        </div>
    );
}