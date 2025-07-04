import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
//import { get } from "mongoose";
export const AdminContext = createContext();
const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const [products, setProducts] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [carts, setCarts] = useState([]);
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState([]);
  const [search, setSearch] = useState("");
  const [filterProducts, setFilterProducts] = useState([]);
  const backendurl = import.meta.env.VITE_BACKEND_URL;
  const getProducts = async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/admin/all-products", {
        headers: { aToken },
      });

      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const getCarts = async (req, res) => {
    try {
      const { data } = await axios.get(backendurl + "/api/admin/all-carts", {
        headers: { aToken },
      });
      if (data) {
        setCarts(data.carts);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const getComments = async (req, res) => {
    try {
      const { data } = await axios.get(backendurl + "/api/admin/comments", {
        headers: { aToken },
      });
      if (data) {
        setComments(data.comments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const changeAvailability = async (itemId) => {
    try {
      const { data } = await axios.post(
        backendurl + "/api/admin/change-product-availability",
        { productId: itemId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success("Thay đổi trạng thái sản phẩm thành công");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.message);
    }
  };
  const removeCart = async (cartId) => {
    try {
      const { data } = await axios.post(
        backendurl + `/api/admin/delete-cart/${cartId}`,
        {},
        { headers: { aToken } }
      );
      if (!data) {
        toast.error("Không có dữ liệu");
      }
      console.log(data);
      setCarts((prevCarts) => prevCarts.filter((cart) => cart._id !== cartId));
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const deleteProduct = async (prid) => {
    try {
      await axios.post(
        backendurl + "/api/product/delete-product",
        { prid: prid },
        { headers: { aToken } }
      );
      toast.success("Xóa sản phẩm thành công!");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const changeBestsellerStatus = async (productId) => {
    try {
      const { data } = await axios.post(
        backendurl + "/api/admin/change-bestseller-status",
        { productId: productId },
        { headers: { aToken } }
      );
      if (!data) {
        toast.error("Không tìm thấy dữ liệu");
      } else {
        toast.success("Thay đổi trạng thái bán chạy thành công");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const getDashData = async () => {
    try {
      const { data } = await axios.get(
        backendurl + "/api/admin/admin-dashboard",
        { headers: { aToken } }
      );
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
        console.log(data.headers);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const getAllReplies = async () => {
    try {
      const { data } = await axios.get(backendurl + "/api/admin/all-replies", {
        headers: { aToken },
      });
      if (!data) {
        toast.error("Không có dữ liệu");
      }
      setReplies(data.replies);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };
  const replyComment = async (commentId, text) => {
    try {
      const x = await axios.post(
        backendurl + "/api/admin/reply",
        { commentId, text },
        {
          headers: { aToken },
        }
      );
      if (!x) {
        toast.error("Không thể trả lời bình luận");
        return null;
      }
      toast.success("Trả lời bình luận thành công");
      return x;
    } catch (error) {
      toast.error(error.message);
      console.log(error);
      throw error;
    }
  };
  const editReply = async (replyId, text) => {
    try {
      const { data } = await axios.post(
        backendurl + "/api/admin/update-reply",
        { replyId, text },
        { headers: { aToken } }
      );
      if (!data) toast.error("Không tìm thấy dữ liệu");
      else toast.success("Chỉnh sửa phản hồi thành công");
    } catch (error) {
      toast.error(error.message);
    }
  };
  const deleteReply = async (replyId) => {
    try {
      const { data } = await axios.post(
        backendurl + "/api/admin/remove-reply",
        { replyId },
        { headers: { aToken } }
      );

      if (!data) {
        toast.error("Không tìm thấy dữ liệu");
      } else {
        toast.success("Xóa phản hồi thành công");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const changeCartStatus = async (cartId, status) => {
    try {
      const response = await axios.post(
        `${backendurl}/api/admin/change-cart-status`,
        {
          cartId,
          status,
        },
        {
          headers: { aToken },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        return true;
      } else {
        toast.error(response.data.message || "Thay đổi trạng thái thất bại");
        return false;
      }
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái giỏ hàng:", error);
      toast.error("Lỗi máy chủ");
      return false;
    }
  };
  const notifyChangeStatusCart = async (cart) => {
    try {
      await axios.post(
        backendurl + "/api/admin/create-notification",
        {
          userId: cart.userId,
          text: cart.text,
          createAt: Date.now(),
          isRead: false,
        },
        { headers: { aToken } }
      );
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  const createReplyNotification = async (userId, replyText, productName) => {
    try {
      const x = await axios.post(
        `${backendurl}/api/admin/create-notification`,
        {
          userId,
          text: `Quản trị viên đã trả lời bình luận của bạn trong trang ${productName}: ${replyText}.`,
        },
        { headers: { aToken } }
      );
    } catch (error) {
      console.error("Không thể tạo thông báo", error);
      toast.error("Lỗi khi gửi thông báo");
    }
  };
  const value = {
    aToken,
    setAToken,
    backendurl,
    products,
    setProducts,
    getProducts,
    changeAvailability,
    dashData,
    getDashData,
    setDashData,
    carts,
    setCarts,
    search,
    setSearch,
    filterProducts,
    setFilterProducts,
    comments,
    setComments,
    getCarts,
    getComments,
    removeCart,
    changeBestsellerStatus,
    replies,
    setReplies,
    getAllReplies,
    replyComment,
    deleteReply,
    editReply,
    changeCartStatus,
    notifyChangeStatusCart,
    createReplyNotification,
    deleteProduct,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};
export default AdminContextProvider;
