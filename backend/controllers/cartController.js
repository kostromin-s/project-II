import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

const removeCart = async (req, res) => {
  try {
    const { cartId } = req.params;

    if (!cartId) {
      return res.status(400).json({ message: "Cần cung cấp cartId" });
    }

    let cart;
    if (cartId) {
      cart = await cartModel.findByIdAndDelete(cartId);
    }
    return res.json({ message: "Giỏ hàng đã được xóa thành công", cart });
  } catch (error) {
    console.error("Lỗi khi xóa giỏ hàng:", error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

const getCarts = async (req, res) => {
  try {
    const carts = await cartModel.find({});

    if (carts.length === 0) {
      return res
        .status(204)
        .json({ success: true, message: "Không tìm thấy giỏ hàng nào" });
    }
    return res.status(200).json({ success: true, carts });
  } catch (error) {
    console.error("Không thể lấy danh sách giỏ hàng", error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

const changeStatus = async (req, res) => {
  try {
    const { cartId, status } = req.body;
    if (!status)
      return res
        .status(404)
        .json({ success: false, message: "Không thể lấy trạng thái" });

    await cartModel.findByIdAndUpdate(cartId, { status }, { new: true });

    return res.status(200).json({
      success: true,
      message: `Thay đổi trạng thái thành công sang ${status}`,
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

const listCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const carts = await cartModel.find({ userId });
    res.json({ success: true, cartData: carts });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await cartModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    if (["shipped", "cancelled"].includes(order.status)) {
      return res.status(400).json({
        message: "Không thể hủy đơn hàng đã được giao hoặc đã bị hủy",
      });
    }
    const product = await productModel.findById(order.itemId);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    await Promise.all([
      cartModel.findByIdAndUpdate(
        orderId,
        { status: "cancelled" },
        { new: true }
      ),
      productModel.findByIdAndUpdate(order.itemId, {
        $inc: { stock_quantity: order.totalItems },
      }),
    ]);
    return res.status(200).json({ message: "Đã hủy đơn hàng thành công" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ nội bộ", error: error.message });
  }
};

// const createCart = async (req, res) => {
//   try {
//     const { userId, itemId, totalItems, paymentMethod, shippingAddress } =
//       req.body;
//     console.log("Tạo giỏ hàng với dữ liệu:", req.body);

//     const itemData = await productModel.findById(itemId);
//     const userData = await userModel.findById(userId).select("-password");

//     if (!itemData || !userData) {
//       console.log("Thiếu sản phẩm hoặc người dùng:", itemData, userData);
//       return res.status(404).json({
//         success: false,
//         message: "Không tìm thấy sản phẩm hoặc người dùng",
//       });
//     }

//     if (totalItems > itemData.stock_quantity || totalItems > 20) {
//       return res.status(400).json({
//         success: false,
//         message: "Tối đa 20 sản phẩm cho mỗi giỏ hoặc không đủ hàng tồn",
//       });
//     }

//     const deliveryDate = new Date();
//     deliveryDate.setDate(deliveryDate.getDate() + 5);

//     const data = {
//       userId,
//       itemId,
//       totalItems,
//       paymentMethod,
//       shippingAddress,
//       status: "processing",
//       itemData,
//       userData,
//       totalPrice: itemData.price * totalItems,
//       paymentStatus: false,
//       deliveryDate,
//     };

//     const newCart = new cartModel(data);
//     let cart;
//     try {
//       cart = await newCart.save();
//     } catch (saveErr) {
//       console.error("Lỗi khi lưu giỏ hàng:", saveErr);
//       return res
//         .status(500)
//         .json({ success: false, message: "Lỗi cơ sở dữ liệu" });
//     }

//     await productModel.findByIdAndUpdate(
//       itemId,
//       { stock_quantity: itemData.stock_quantity - totalItems },
//       { new: true }
//     );

//     res.json({
//       success: true,
//       message: "Tạo giỏ hàng thành công",
//       cartData: cart,
//     });
//   } catch (error) {
//     console.error("Lỗi không xác định:", error);
//     res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
//   }
// };

const createCart = async (req, res) => {
  try {
    const { userId, itemId, totalItems, paymentMethod, shippingAddress } =
      req.body;
    console.log("🎯 Dữ liệu req.body:", req.body);

    // Kiểm tra ID có hợp lệ không
    if (!userId || !itemId) {
      console.log("❌ Thiếu userId hoặc itemId");
      return res
        .status(400)
        .json({
          success: false,
          message: "Thiếu thông tin sản phẩm hoặc người dùng",
        });
    }

    const itemData = await productModel.findById(itemId);
    console.log("📦 itemData:", itemData);

    const userData = await userModel.findById(userId).select("-password");
    console.log("👤 userData:", userData);

    if (!itemData || !userData) {
      console.log("❌ Không tìm thấy item hoặc user");
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm hoặc người dùng",
      });
    }

    if (totalItems > itemData.stock_quantity || totalItems > 20) {
      console.log("⚠️ Số lượng không hợp lệ:", totalItems);
      return res.status(400).json({
        success: false,
        message: "Tối đa 20 sản phẩm cho mỗi giỏ hoặc không đủ hàng tồn",
      });
    }

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    const data = {
      userId,
      itemId,
      totalItems,
      paymentMethod,
      shippingAddress,
      status: "processing",
      itemData,
      userData,
      totalPrice: itemData.price * totalItems,
      paymentStatus: false,
      deliveryDate,
    };

    const newCart = new cartModel(data);
    let cart;
    try {
      console.log("💾 Đang lưu giỏ hàng...");
      cart = await newCart.save();
      console.log("✅ Lưu giỏ hàng thành công:", cart._id);
    } catch (saveErr) {
      console.error("❌ Lỗi khi lưu giỏ hàng:", saveErr.message);
      return res
        .status(500)
        .json({ success: false, message: "Lỗi cơ sở dữ liệu" });
    }

    await productModel.findByIdAndUpdate(
      itemId,
      { stock_quantity: itemData.stock_quantity - totalItems },
      { new: true }
    );

    res.json({
      success: true,
      message: "Tạo giỏ hàng thành công",
      cartData: cart,
    });
  } catch (error) {
    console.error("🔥 Lỗi không xác định:", error.message);
    res.status(500).json({ success: false, message: "Lỗi máy chủ nội bộ" });
  }
};

export {
  removeCart,
  getCarts,
  changeStatus,
  listCart,
  cancelOrder,
  createCart,
};
