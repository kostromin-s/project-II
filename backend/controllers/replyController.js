import axios from "axios";
import commentModel from "../models/commentModel.js";
import replyModel from "../models/replyModel.js";

const replyComment = async (req, res) => {
  try {
    const { commentId, text } = req.body;
    if (!commentId)
      return res
        .status(400)
        .json({
          success: false,
          message: "Không lấy được bình luận theo comment id",
        });
    const commentData = await commentModel.findById(commentId);
    if (!commentData)
      return res
        .status(400)
        .json({ success: false, message: "Không lấy được dữ liệu bình luận" });
    const value = {
      commentId,
      commentData,
      text,
      createAt: Date.now(),
    };
    const newReply = new replyModel(value);
    await newReply.save();
    return res
      .status(200)
      .json({ success: true, message: "Trả lời thành công" });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ success: false, message: "Lỗi khi trả lời" });
  }
};

const getAllReplies = async (req, res) => {
  try {
    const data = await replyModel.find({});
    if (!data) {
      return res.status(200).json({ success: true, replies: [] });
    }
    return res.status(200).json({ success: true, replies: data });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ success: false, message: "Lỗi server" });
  }
};

const getReplyByComment = async (req, res) => {
  try {
    const commentId = req.body;
    const { data } = await replyModel.find({ commentId: commentId });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      success: false,
      message: "Server không lấy được phản hồi của bình luận này",
    });
  }
};

const getReplyByUser = async (req, res) => {
  try {
    const { userId } = req.body;

    // Tìm tất cả bình luận của user
    const commentData = await commentModel.find({ userId });

    // Nếu không có bình luận thì không có phản hồi
    if (!commentData || commentData.length === 0) {
      return res
        .status(204)
        .json({
          success: true,
          message: "Chưa có dữ liệu bình luận và phản hồi",
        });
    }

    // Lấy danh sách các comment._id
    const commentIds = commentData.map((comment) => comment._id);

    // Tìm các phản hồi có commentId nằm trong danh sách commentIds
    const replyData = await replyModel.find({ commentId: { $in: commentIds } });

    // Trả về danh sách phản hồi
    return res.status(200).json({
      success: true,
      replies: replyData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const editReply = async (req, res) => {
  try {
    const { replyId, text } = req.body;

    if (!replyId || !text) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu replyId hoặc nội dung" });
    }

    const updatedReply = await replyModel.findByIdAndUpdate(
      replyId,
      { text },
      { new: true } // trả về document mới
    );

    if (!updatedReply) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy phản hồi" });
    }

    return res.status(200).json({
      success: true,
      message: "Cập nhật phản hồi thành công",
      data: updatedReply, // tùy chọn gửi lại dữ liệu
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật phản hồi:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

const removeReply = async (req, res) => {
  try {
    const { replyId } = req.body;

    if (!replyId) {
      return res.status(400).json({ success: false, message: "Thiếu replyId" });
    }

    const deletedReply = await replyModel.findByIdAndDelete(replyId);

    if (!deletedReply) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy phản hồi" });
    }

    return res.status(200).json({
      success: true,
      message: "Xóa phản hồi thành công",
      data: deletedReply, // tùy chọn gửi lại dữ liệu đã xóa nếu cần
    });
  } catch (error) {
    console.error("Lỗi khi xóa phản hồi:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

export {
  replyComment,
  getAllReplies,
  getReplyByComment,
  getReplyByUser,
  editReply,
  removeReply,
};
