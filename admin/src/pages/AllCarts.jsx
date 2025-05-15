import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";

const AllCarts = () => {
  const {
    aToken,
    carts,
    getCarts,
    removeCart,
    changeCartStatus,
    notifyChangeStatusCart,
  } = useContext(AdminContext);

  const [changeCart, setChangeCart] = useState(false);
  const [selectedCart, setSelectedCart] = useState(null);

  useEffect(() => {
    const fetchCarts = async () => {
      if (aToken) {
        try {
          await getCarts();
        } catch (error) {
          console.error("Error fetching carts:", error);
        }
      }
    };
    fetchCarts();
  }, [aToken, changeCart]);

  const handleDeleteClick = (cart) => {
    setSelectedCart(cart);
  };

  const confirmDelete = async () => {
    if (selectedCart) {
      try {
        await removeCart(selectedCart._id);
        await notifyChangeStatusCart({
          userId: selectedCart.userId,
          text: `The cart (id: #${selectedCart._id}) that has ${selectedCart.totalItems} item(s) of ${selectedCart.itemData.name} you ordered has been deleted by admin.`,
        });
        setChangeCart((prev) => !prev);
        setSelectedCart(null);
        toast.success("Xoá thành công");
      } catch (error) {
        console.error("Error deleting cart:", error);
      }
    }
  };

  const handleStatusChange = async (cart, newStatus) => {
    const success = await changeCartStatus(cart._id, newStatus);
    if (success) {
      await notifyChangeStatusCart({
        userId: cart.userId,
        text: `The cart (id: #${cart._id}) that has ${cart.totalItems} item(s) of ${cart.itemData.name} was updated to ${newStatus} by admin.`,
      });
      setChangeCart((prev) => !prev);
    }
  };

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">Tất cả giỏ hàng</p>
      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        {/* Header (Desktop only) */}
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_2fr_1fr_1fr_2fr] py-3 px-6 border-b font-semibold text-gray-700">
          <p>#</p>
          <p>Sản phẩm</p>
          <p>Số lượng</p>
          <p>Tổng giá</p>
          <p>Trạng thái</p>
          <p>Hành động</p>
        </div>

        {/* Cart rows */}
        {carts.map((cart, index) => (
          <div
            key={cart._id}
            className="border-b py-3 px-6 hover:bg-gray-50 sm:grid sm:grid-cols-[0.5fr_2fr_2fr_1fr_1fr_2fr] flex flex-col gap-2 sm:gap-0"
          >
            {/* Index (only desktop) */}
            <p className="hidden sm:block">{index + 1}</p>

            {/* Product */}
            <div className="flex items-center gap-2">
              <img
                className="w-8 h-8 rounded-full object-cover"
                src={cart.itemData.image_url}
                alt="Sản phẩm"
              />
              <p className="font-medium">{cart.itemData.name}</p>
            </div>

            {/* Items */}
            <p>
              <span className="sm:hidden font-semibold">Số lượng: </span>
              {cart.totalItems}
            </p>

            {/* Price */}
            <p>
              <span className="sm:hidden font-semibold">Giá: </span>
              {cart.totalPrice} VNĐ
            </p>

            {/* Status */}
            <div>
              <span className="sm:hidden font-semibold">Trạng thái: </span>
              <select
                value={cart.status}
                onChange={(e) => handleStatusChange(cart, e.target.value)}
                className="text-xs border rounded px-2 py-1 bg-white"
              >
                <option value="processing">Đang xử lý</option>
                <option value="shipped">Đã giao</option>
                <option value="cancelled">Đã huỷ</option>
              </select>
            </div>

            {/* Actions */}
            <div>
              <button
                onClick={() => handleDeleteClick(cart)}
                className="text-red-500 hover:text-red-700 text-xs underline"
              >
                Xoá
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {selectedCart && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-5 w-11/12 max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Xoá giỏ hàng của {selectedCart.itemData.name}?
            </h3>
            <p className="text-gray-700">
              Bạn có chắc chắn muốn xoá giỏ hàng có{" "}
              <b>{selectedCart.totalItems}</b> sản phẩm không?
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedCart(null)}
                className="px-4 py-2 mr-2 bg-gray-300 text-gray-800 rounded"
              >
                Huỷ
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCarts;
