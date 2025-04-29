import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  addPendingForgot,
  getPendingForgot,
  removePendingForgot,
} from "../utils/pendingForgot.js";
import {
  addPendingUser,
  getPendingUser,
  removePendingUser,
} from "../utils/pendingUser.js";
import { sendEmail } from "../utils/sendEmail.js";

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const data = await userModel.findOne({ email });
    if (data)
      return res.json({
        success: false,
        message: "Tài khoản email đã tồn tại!",
      });
    if (!username || !email || !password) {
      return res.json({ success: false, message: "Thiếu thông tin" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Email không hợp lệ" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Vui lòng nhập mật khẩu mạnh hơn",
      });
    }
    console.log({ username, email });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userData = {
      name: username,
      email,
      password: hashedPassword,
    };
    const tokenGmail = jwt.sign({ email, userData }, process.env.JWT_SECRET);
    addPendingUser(email, { hashedPassword, tokenGmail });

    const verifyLink = `${process.env.FE_URL}/verify?tokenGmail=${tokenGmail}`;
    await sendEmail(
      email,
      "Xác thực tài khoản trên website HNshop",
      `Nhấn vào đây để xác thực: ${verifyLink}`
    );

    return res.json({
      success: true,
      message: "Vui lòng kiểm tra email để xác thực",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Lỗi đăng ký" });
  }
};

const verify = async (req, res) => {
  try {
    const tokenGmail = req.query.tokenGmail;
    if (!tokenGmail)
      return res
        .status(400)
        .json({ success: false, message: "Không tìm thấy gmail!" });
    const decoded = jwt.verify(tokenGmail, process.env.JWT_SECRET);

    const email = decoded.email;
    const userData = decoded.userData;
    console.log({ email, userData });

    const pending = getPendingUser(email);

    if (!pending) {
      return res.status(400).send("Token đã hết hạn.");
    }
    console.log(pending.tokenGmail);

    if (pending.tokenGmail !== tokenGmail)
      return res.status(400).send("Token không hợp lệ");
    const newUser = new userModel(userData);

    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    removePendingUser(email);
    return res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Lỗi xác thực" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email)
      return res.json({ success: false, message: "Không tìm thấy email" });
    const userData = await userModel.findOne({ email }).select("-password");

    if (!userData)
      return res.json({
        success: false,
        message: "Email người dùng không tồn tại",
      });
    const user_encode = jwt.sign(
      { userId: userData._id },
      process.env.JWT_SECRET
    );
    const verifyLink = `${process.env.FE_URL}/changePassword?user=${user_encode}&email=${email}`;
    await sendEmail(
      email,
      "Bạn đã yêu cầu đổi mật khẩu trên website HNshop",
      `Nhấn vào đây để đổi mật khẩu: ${verifyLink}`
    );
    addPendingForgot(email);
    return res.json({
      success: true,
      message: "Vui lòng kiểm tra email để xác thực thay đổi mật khẩu",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Lỗi máy chủ!" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId)
      return res.json({ success: false, message: "Không tìm thấy user id!" });
    await userModel.findByIdAndDelete(userId);
    return res.json({ success: true, message: "Xóa người dùng thành công!" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: "Lỗi máy chủ!" });
  }
};

const verifyChangePassword = async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res.json({ success: false, message: "Dữ liệu không hợp lệ" });
    }

    let decoded;
    try {
      decoded = jwt.verify(userId, process.env.JWT_SECRET);
    } catch (err) {
      return res.json({
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
    }

    const realUserId = decoded.userId;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.findByIdAndUpdate(realUserId, {
      password: hashedPassword,
    });

    if (!user) {
      return res.json({
        success: false,
        message: "Không tìm thấy người dùng!",
      });
    }

    removePendingForgot(user.email);

    return res.json({ success: true, message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Lỗi máy chủ!" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Người dùng không tồn tại" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    } else {
      return res.json({
        success: false,
        message: "Thông tin đăng nhập không đúng",
      });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;
    if (!name || !phone || !dob || !gender || !address) {
      return res.json({ success: false, message: "Thiếu dữ liệu" });
    }
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address,
      dob,
      gender,
    });
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageUrl = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
    }
    res.json({ success: true, message: "Cập nhật hồ sơ thành công" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  verify,
  forgotPassword,
  verifyChangePassword,
  deleteUser,
};
