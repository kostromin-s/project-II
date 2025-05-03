import notificationModel from "../models/notificationModel.js";

const createNotification = async (req, res) => {
  try {
    const { userId, text } = req.body;
    if (!userId || !text)
      return res
        .status(400)
        .json({
          success: false,
          message: "Không thể tạo thông báo. Vui lòng thử lại sau!",
        });
    const data = {
      userId,
      text,
      createAt: Date.now(), // ❗ Nếu bạn có thể sửa database thì nên đổi thành `createdAt` để thống nhất
      isRead: false,
    };
    const newData = new notificationModel(data);
    await newData.save();
    return res.status(200).json({ success: true, data: newData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.body;
    if (!notificationId)
      return res
        .status(400)
        .json({
          success: false,
          message: "Không tìm thấy thông báo. Vui lòng thử lại sau!",
        });
    await notificationModel.findByIdAndDelete(notificationId);
    return res
      .status(200)
      .json({ success: true, message: "Xóa thông báo thành công" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

const getNewNotification = async (req, res) => {
  try {
    const { userId } = req.body;

    const notifications = await notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error("Lỗi khi lấy thông báo mới:", error);
    return res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

const markOneAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;

    const updated = await notificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy thông báo" });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("Lỗi khi đánh dấu đã đọc:", error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.body;

    const result = await notificationModel.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    return res
      .status(200)
      .json({
        success: true,
        message: "Tất cả thông báo đã được đánh dấu là đã đọc",
      });
  } catch (error) {
    console.error("Lỗi khi đánh dấu tất cả là đã đọc:", error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel
      .find()
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách thông báo:", error);
    return res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

const createReplyNotification = async (req, res) => {
  try {
    const { text, userId } = req.body;

    if (!userId || !text) {
      return res.status(400).json({ message: "Thiếu userId hoặc nội dung" });
    }

    const newNotification = new notificationModel({
      userId,
      text,
      createAt: Date.now(),
      isRead: false,
    });

    await newNotification.save();

    return res.status(200).json({
      success: true,
      data: newNotification,
    });
  } catch (error) {
    console.error("Lỗi khi tạo thông báo phản hồi:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

const getNotificationsByUser = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId)
      return res.status(400).json({ success: false, message: "Thiếu userId" });
    const notifications = await notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(15);
    if (!notifications || notifications.length === 0)
      return res.status(200).json({ success: true, data: [] });
    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error("Lỗi khi lấy thông báo:", error);
    return res
      .status(500)
      .json({ success: false, message: "Không thể lấy danh sách thông báo" });
  }
};

export {
  createNotification,
  deleteNotification,
  getNewNotification,
  markOneAsRead,
  markAllAsRead,
  getAllNotifications,
  createReplyNotification,
  getNotificationsByUser,
};
