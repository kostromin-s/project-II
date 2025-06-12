import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Cart = () => {
  const { backendurl, token } = useContext(AppContext);
  const [cart, setCart] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const navigate = useNavigate();

  const getMyCart = async () => {
    try {
      const response = await axios.get(`${backendurl}/api/cart/list-mycart`, {
        headers: { token },
      });
      if (response.data) {
        setCart(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleRemovePermanently = async (id) => {
    try {
      await axios.post(
        `${backendurl}/api/cart/remove-cart/${id}`,
        {},
        { headers: { token } }
      );
      toast.success("Xóa đơn hàng vĩnh viễn");
      await getMyCart();
    } catch (error) {
      toast.error("Xóa không thành công");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.post(
        `${backendurl}/api/cart/cancel-order`,
        { orderId: deleteItemId },
        { headers: { token } }
      );

      if (response.status === 200) {
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
        await getMyCart();
      } else {
        toast.error("Xóa sản phẩm thất bại");
      }

      setDeleteItemId("");
      setShowConfirm(false);
    } catch (error) {
      console.log(error);
      toast.error("Xóa sản phẩm thất bại");
      setShowConfirm(false);
    }
  };

  const handlePayment = async (cart) => {
    try {
      const response = await axios.post(
        `${backendurl}/api/user/pay-cart`,
        { cart },
        { headers: { token } }
      );

      const paymentUrl = response.data?.order_url;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        toast.error("Không có liên kết thanh toán");
      }
    } catch (error) {
      console.log(error);
      toast.error("Thanh toán thất bại");
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      await getMyCart();
    };
    fetchCart();
  }, [token]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get("payment");

    if (paymentSuccess === "success") {
      getMyCart();
      toast.success("Thanh toán thành công!");
    }
  }, []);

  return (
    token && (
      <div className="mx-auto p-1">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-1">
          🛒 Giỏ hàng của tôi
        </h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
          {cart.map((item, index) => (
            <div
              className="flex flex-col md:flex-row sm:w-96 md:w-auto items-center gap-6 p-2 md:p-3 border rounded-lg shadow-md bg-white hover:bg-indigo-100"
              key={index}
            >
              <img
                className="w-28 h-28 object-cover rounded-lg border"
                src={item.itemData.image_url}
                alt=""
              />

              <div className="flex-1">
                <p className="text-md mb-1 md:text-xl">
                  {item.itemData.name}&nbsp;&nbsp;&nbsp;
                  {item.status === "processing" ? (
                    <div className="text-gray-500 text-xs">Đang giao hàng</div>
                  ) : item.status === "shipped" ||
                    item.paymentStatus === true ? (
                    <span className="text-green-600 flex items-center gap-1 text-sm">
                      <FaCheckCircle className="text-green-600 text-xs" /> Đã
                      hoàn tất
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center gap-1 text-sm">
                      <FaTimesCircle /> Đã hủy
                    </span>
                  )}
                </p>

                <p className="text-gray-600 text-sm">
                  Số lượng: {item.totalItems}
                </p>
                <p className="text-gray-700 font-medium mt-2 text-xs md:text-sm">
                  💰 Giá:{" "}
                  <span className="text-primary text-xs md:text-sm">
                    {item.totalPrice} ₫
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  🕒 Đặt ngày:{" "}
                  {new Date(
                    new Date(item.deliveryDate).getTime() -
                      5 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {item.status === "processing" &&
                  item.paymentStatus === false && (
                    <button
                      onClick={() => handlePayment(item)}
                      className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 transition rounded-lg text-sm"
                    >
                      Thanh toán online
                    </button>
                  )}

                {item.paymentStatus === true && (
                  <p className="px-4 py-2 text-sm text-green-600 border border-green-500 rounded-lg text-center">
                    ✅ Đã thanh toán
                  </p>
                )}

                {(item.status === "cancelled" ||
                  item.status === "processing") && (
                  <button
                    className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 transition rounded-lg"
                    onClick={() => {
                      setDeleteItemId(item._id);
                      setShowConfirm(true);
                    }}
                  >
                    🗑 Xóa
                  </button>
                )}

                {item.cancelled && (
                  <p className="px-4 py-2 text-sm text-red-700 border border-red-500 rounded-lg text-center">
                    ❌ Mục này đã bị hủy
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {showConfirm && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="text-lg font-semibold mb-4">
                Bạn có chắc muốn xóa sản phẩm này không?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  onClick={handleDelete}
                >
                  Xác nhận
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                  onClick={() => setShowConfirm(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default Cart;
