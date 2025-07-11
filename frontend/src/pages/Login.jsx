import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { backendurl, token, setToken, sendChangePassword } =
    useContext(AppContext);

  const [state, setState] = useState("Login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [againPassword, setAgainPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (state === "Sign Up") {
        if (againPassword !== password) {
          toast.error("Mật khẩu nhập lại không đúng!");
          setLoading(false);
          return;
        }

        const { data } = await axios.post(backendurl + "/api/user/register", {
          username,
          password,
          email,
        });

        if (data && data.success) {
          toast.success("Kiểm tra email để xác thực và đăng nhập");
          setUsername("");
          setPassword("");
          setAgainPassword("");
          setEmail("");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendurl + "/api/user/login", {
          password,
          email,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Đăng nhập thành công!");
          setPassword("");
          setEmail("");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast.error("Vui lòng nhập email");
      return;
    }

    try {
      await sendChangePassword(forgotEmail);
      toast.success("Vui lòng kiểm tra email để đặt lại mật khẩu");
      setShowForgotPasswordModal(false);
      setForgotEmail("");
    } catch (error) {
      toast.error("Gửi email thất bại");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div
      className="bg-cover bg-center min-h-screen"
      style={{ backgroundImage: `url(${assets.bg})` }}
    >
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="border-t-transparent border-4 border-white rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}

      {showForgotPasswordModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-80 relative">
            <h2 className="text-lg font-semibold mb-4">Đặt lại mật khẩu</h2>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="border border-zinc-500 rounded w-full p-2 mb-4"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Đóng
              </button>
              <button
                onClick={handleForgotPassword}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Gửi email
              </button>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={onSubmitHandler}
        className="min-h-[80vh] flex items-center"
      >
        <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl bg-white text-zinc-600 text-sm shadow-lg">
          <p className="text-2xl font-semibold">
            {state === "Sign Up" ? "Tạo tài khoản" : "Đăng nhập"}
          </p>
          <p>
            Vui lòng {state === "Sign Up" ? "đăng ký" : "đăng nhập"} để sử dụng
            các tính năng nâng cao
          </p>

          {state === "Sign Up" && (
            <div className="w-full">
              <p>Họ và tên</p>
              <input
                className="border border-zinc-500 rounded w-full p-2 mt-1"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                required
              />
            </div>
          )}

          <div className="w-full">
            <p>Email</p>
            <input
              className="border border-zinc-500 rounded w-full p-2 mt-1"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <div className="w-full">
            <p>Mật khẩu</p>
            <input
              className="border border-zinc-500 rounded w-full p-2 mt-1"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          {state === "Sign Up" && (
            <div className="w-full">
              <p>Nhập lại mật khẩu</p>
              <input
                className="border border-zinc-500 rounded w-full p-2 mt-1"
                type="password"
                onChange={(e) => setAgainPassword(e.target.value)}
                value={againPassword}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-primary text-white w-full py-2 rounded-md text-base cursor-pointer"
          >
            {state === "Sign Up" ? "Tạo tài khoản" : "Đăng nhập"}
          </button>

          {state === "Sign Up" ? (
            <p>
              Đã có tài khoản?{" "}
              <span
                onClick={() => setState("Login")}
                className="text-primary underline cursor-pointer"
              >
                Đăng nhập tại đây
              </span>
            </p>
          ) : (
            <p>
              Chưa có tài khoản?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="text-primary underline cursor-pointer"
              >
                Tạo tài khoản mới
              </span>
            </p>
          )}

          {state === "Login" && (
            <p className="mt-0">
              Quên mật khẩu?{" "}
              <span
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-blue-600 underline cursor-pointer"
              >
                Nhấn vào đây
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
