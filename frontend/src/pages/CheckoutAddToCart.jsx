import React, { use, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const CheckoutAddToCart = () => {
  const navigate = useNavigate();
  const { products, userData, backendurl, token } = useContext(AppContext);
  const location = useLocation();
  const cartData =
    location.state || JSON.parse(localStorage.getItem("cartData"));
  const [address, setAddress] = useState(userData.address);
  const [payment, setPayment] = useState("Cash");
  const product = products.find((p) => p._id === cartData.prID);
  const [openChoosingMethod, setOpenChoosingMethod] = useState(false);
  const totalPrice = product ? product.price * cartData.quantity : 0;

  const handleAddCart = async () => {
    try {
      if (!token) {
        toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
        return;
      }

      const addCart = await axios.post(
        backendurl + "/api/cart/create-cart",
        {
          userId: userData._id,
          itemId: cartData.prID,
          totalItems: cartData.quantity,
          paymentMethod: payment,
          shippingAddress: address,
        },
        { headers: { token } }
      );

      if (addCart) {
        toast.success("Thêm vào giỏ hàng thành công");
        navigate("/mycart", { replace: true }); // <-- chỉ chuyển trang nếu thành công
      }
    } catch (error) {
      console.error("❌ Lỗi gửi request:", error);

      // Ưu tiên lấy lỗi từ backend gửi về (nếu có)
      const errorMessage =
        error.response?.data?.message || "Đã xảy ra lỗi không xác định";

      toast.error(errorMessage);
    }
  };

  return (
    token && (
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Xác nhận đơn hàng
        </h1>

        <div className="flex flex-col md:flex-row items-center bg-gray-100 p-6 rounded-lg">
          <img
            src={product?.image_url}
            alt={product?.name}
            className="w-1/3 rounded-lg shadow-md"
          />
          <div className="ml-6">
            <h2 className="text-3xl font-semibold mb-4">{product?.name}</h2>
            <p className="text-gray-600 mt-6">
              Giá: {product?.price.toFixed(0)} đ
            </p>
            <p className="text-gray-600 mt-4">Số lượng: {cartData.quantity}</p>
            <p className="text-lg font-bold mt-4">
              Tổng: {totalPrice.toFixed(0)} đ
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Phương thức thanh toán:
          </h3>
          <div className="relative w-48">
            <button
              className="w-full py-2 px-4 border rounded text-sm bg-gray-100 hover:bg-gray-200 transition"
              onClick={() => setOpenChoosingMethod((prev) => !prev)}
            >
              {payment}
            </button>

            {openChoosingMethod && (
              <div className="absolute left-0 mt-2 w-full bg-white border shadow-lg rounded-md z-10">
                {[
                  { label: "Tiền mặt", value: "Cash" },
                  { label: "Thanh toán online", value: "Pay online" },
                ].map((method) => (
                  <p
                    key={method.value}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white transition"
                    onClick={() => {
                      setPayment(method.value); // vẫn lưu giá trị "Cash" hoặc "Pay online"
                      setOpenChoosingMethod(false);
                    }}
                  >
                    {method.label}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Địa chỉ giao hàng
          </h2>
          <input
            type="text"
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Nhập địa chỉ giao hàng của bạn"
            className="mt-2 border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={() => handleAddCart()}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-shadow shadow-md"
        >
          Xác nhận đơn hàng
        </button>
      </div>
    )
  );
};

export default CheckoutAddToCart;
