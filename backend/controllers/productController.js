import productModel from "../models/productModel.js";
import cartModel from "../models/cartModel.js";
import { v2 as cloudinary } from "cloudinary";

const detailProduct = async (req, res) => {
  try {
    const { prId } = req.params;
    const product = await productModel.findById(prId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Không thể tìm sản phẩm" });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Lấy thông tin đơn hàng
    const order = await cartModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    if (["shipped", "cancelled"].includes(order.status)) {
      return res.status(400).json({
        message: "Không thể hủy đơn hàng đã được giao hoặc đã hủy",
      });
    }

    const product = await productModel.findById(order.itemId);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    const [updatedOrder, _] = await Promise.all([
      cartModel.findByIdAndUpdate(
        orderId,
        { status: "cancelled" },
        { new: true }
      ),
      productModel.findByIdAndUpdate(order.itemId, {
        $inc: { stock_quantity: order.totalItems },
      }),
    ]);

    return res
      .status(200)
      .json({ message: "Hủy đơn hàng thành công", updatedOrder });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống", error: error.message });
  }
};

const changeBestsellerStatus = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId)
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });

    // Tìm sản phẩm trước để lấy giá trị bestseller hiện tại
    const product = await productModel.findById(productId);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });

    // Đảo ngược trạng thái bestseller
    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      { bestseller: !product.bestseller },
      { new: true }
    );

    return res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Thay đổi trạng thái bán chạy thất bại",
      });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      productId,
      price,
      stock_quantity,
      name,
      category,
      brand,
      description,
    } = req.body;
    const specs = JSON.parse(req.body.specifications);
    const imageFile = req.file;

    let imageURL = req.body.image_url; // giữ ảnh cũ nếu không upload ảnh mới

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      imageURL = imageUpload.secure_url;
    }

    const product = await productModel.findByIdAndUpdate(
      productId,
      {
        price,
        stock_quantity,
        name,
        category,
        brand,
        description,
        image_url: imageURL,
        specifications: specs,
      },
      { new: true }
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });
    }

    return res.json({ success: true, data: product });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const prid = req.body.prid;
    await productModel.findByIdAndDelete(prid);
    return res
      .status(204)
      .json({ success: true, message: "Xóa sản phẩm thành công!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ!" });
  }
};

const getProducts = async (req, res) => {
  try {
    const { query, category, brand, minPrice, maxPrice } = req.query;
    let filter = [];

    if (query) {
      filter.push({
        $or: [
          { brand: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      });
    }

    if (category) {
      filter.push({ category });
    }

    if (brand) {
      filter.push({ brand });
    }

    let priceFilter = {};
    if (minPrice) priceFilter.$gte = parseFloat(minPrice) || 0;
    if (maxPrice) priceFilter.$lte = parseFloat(maxPrice) || Infinity;
    if (Object.keys(priceFilter).length > 0) {
      filter.push({ price: priceFilter });
    }

    const products = await productModel.find(
      filter.length ? { $and: filter } : {}
    );
    return res.json({ success: true, products: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  detailProduct,
  cancelOrder,
  changeBestsellerStatus,
  updateProduct,
  getProducts,
  deleteProduct,
};
