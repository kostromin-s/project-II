import commentModel from "../models/commentModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

const createComment = async (req, res) => {
  try {
    const { userId, productId, text, rating = null } = req.body;

    // Kiểm tra xem người dùng đã bình luận sản phẩm này chưa
    const existingComment = await commentModel.findOne({ userId, productId });

    if (existingComment) {
      return res.status(400).json({
        error:
          "Bạn đã bình luận sản phẩm này rồi. Vui lòng chỉnh sửa bình luận thay vì tạo mới.",
      });
    }

    const productData = await productModel.findById(productId);
    const userData = await userModel.findById(userId).select("-password");

    if (!productData || !userData)
      return res
        .status(400)
        .json({ error: "Không tìm thấy người dùng hoặc sản phẩm" });

    // Tạo bình luận mới với rating mặc định là null nếu không có
    const newComment = new commentModel({
      userId,
      productId,
      text,
      rating,
      userData,
      productData,
    });
    await newComment.save();

    res
      .status(201)
      .json({ message: "Tạo bình luận thành công!", comment: newComment });
  } catch (error) {
    res.status(500).json({ error: "Tạo bình luận thất bại!" });
  }
};

const getAllComments = async (req, res) => {
  try {
    const comments = await commentModel.find(); // Lấy tất cả bình luận từ database
    res.status(200).json({ success: true, comments: comments });
  } catch (error) {
    res.status(500).json({ error: "Lấy danh sách bình luận thất bại!" });
  }
};

const getCommentsByUser = async (req, res) => {
  try {
    const { userId } = req.body; // Lấy userId từ body
    const comments = await commentModel.find({ userId });

    if (!comments || comments.length === 0) {
      return res.status(200).json({ success: true, comments: [] });
    }

    res.status(200).json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ error: "Lấy bình luận theo người dùng thất bại!" });
  }
};

const getCommentsByProduct = async (req, res) => {
  try {
    const { prID } = req.params; // Lấy productId từ URL
    if (!prID)
      return res.status(404).json({ error: "Không tìm thấy productId" });

    const comments = await commentModel.find({ productId: prID });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: "Lấy bình luận theo sản phẩm thất bại!" });
  }
};

const updateComment = async (req, res) => {
  try {
    const { productId, userId, text } = req.body;

    if (!productId || !userId || !text.trim()) {
      return res.status(400).json({ message: "Thiếu dữ liệu đầu vào" });
    }

    // Tìm bình luận của user cho sản phẩm này
    let comment = await commentModel.findOne({ productId, userId });

    if (comment) {
      // Nếu đã có bình luận, cập nhật nội dung mới
      comment.text = text;
      comment.updatedAt = new Date();
      await comment.save();
      return res
        .status(200)
        .json({ message: "Bình luận đã được cập nhật", comment });
    } else {
      // Nếu chưa có bình luận, tạo mới
      comment = new commentModel({ productId, userId, text });
      await comment.save();
      return res
        .status(201)
        .json({ message: "Bình luận đã được thêm", comment });
    }
  } catch (error) {
    console.error("Lỗi cập nhật bình luận:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export {
  createComment,
  getAllComments,
  getCommentsByUser,
  getCommentsByProduct,
  updateComment,
};
