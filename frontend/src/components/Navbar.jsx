import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import SearchEngine from "./SearchEngine";
import { AppContext } from "../context/AppContext";
import { FaBell, FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const {
    token,
    setToken,
    backendurl,
    userData,
    search,
    setSearch,
    getNotifications,
    notifications,
    markOneAsRead,
    markAllAsRead,
  } = useContext(AppContext);
  const [showNotification, setShowNotification] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const deleteToken = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  const countNewNotifications = () => {
    const count = (notifications ?? []).filter((item) => !item.isRead).length;
    setCountNewNoti(count);
  };

  const [countNewNoti, setCountNewNoti] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        await getNotifications();
        countNewNotifications();
      }
    };
    fetchData();
  }, [token, markAllAsRead, markOneAsRead]);

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 relative z-50">
      <img
        onClick={() => navigate("/")}
        className="w-28 md:w-40 cursor-pointer"
        src={assets.logo}
        alt="Logo của chúng tôi"
      />

      <ul className="hidden md:flex items-start gap-6 font-medium text-sm">
        <NavLink
          className="p-2 hover:bg-gray-100 rounded-md w-20 text-center"
          to="/"
        >
          <li className="py-1">Trang chủ</li>
        </NavLink>
        <NavLink
          className="p-2 hover:bg-gray-100 rounded-md w-32 text-center"
          to="/products"
        >
          <li className="py-1">Tất cả sản phẩm</li>
        </NavLink>
        <NavLink
          className="p-2 hover:bg-gray-100 rounded-md w-20 text-center"
          to="/about"
        >
          <li className="py-1">Giới thiệu</li>
        </NavLink>
        <NavLink
          className="p-2 hover:bg-gray-100 rounded-md w-24 text-center"
          to="/contact"
        >
          <li className="py-1">Liên hệ</li>
        </NavLink>
      </ul>

      <div className="md:block hidden">
        <SearchEngine
          className="md:block hidden"
          search={search}
          setSearch={setSearch}
        />
      </div>

      <img
        onClick={() => setShowMenu(true)}
        className="md:hidden w-4"
        src={assets.menu_icon}
        alt=""
      />

      <div
        className={`${
          showMenu ? "fixed w-full" : "h-0 w-0"
        } md:hidden right-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <img className="w-36" src={assets.logo} alt="" />
          <img
            className="w-7"
            onClick={() => setShowMenu(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <ul className="flex flex-col items-center gap-2 mt-5 px-5 font-medium text-lg hover:bg-primary">
          <SearchEngine
            className="md:block hidden"
            search={search}
            setSearch={setSearch}
          />
          <NavLink onClick={() => setShowMenu(false)} to="/">
            <p className="px-4 py-2 rounded inline-block">Trang chủ</p>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/products">
            <p className="px-4 py-2 rounded inline-block">Tất cả sản phẩm</p>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/about">
            <p className="px-4 py-2 rounded inline-block">Giới thiệu</p>
          </NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/contact">
            <p className="px-4 py-2 rounded inline-block">Liên hệ</p>
          </NavLink>
        </ul>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {token && (
          <div
            onClick={() => navigate("/mycart")}
            className="relative cursor-pointer p-2 rounded-full hover:bg-gray-200 transition"
            title="Giỏ hàng của tôi"
          >
            <FaShoppingCart className="text-[22px] text-gray-700 hover:text-blue-500 w-4 md:w-6" />
          </div>
        )}

        {token && notifications && (
          <div className="relative">
            <FaBell
              className="w-4 md:w-6 h-6 cursor-pointer text-gray-700 hover:text-primary transition duration-200"
              onClick={() => setShowNotification((prev) => !prev)}
            />
            {notifications && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {countNewNoti > 9 ? "9+" : countNewNoti}
              </span>
            )}
            {showNotification && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-80 max-h-96 flex flex-col z-50">
                <div className="flex-1 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-gray-500">Không có thông báo</p>
                  ) : (
                    notifications.slice(0, 15).map((n, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedNotification(n);
                          setShowDetailModal(true);
                          markOneAsRead(n._id);
                        }}
                        className={`p-3 border-b hover:bg-gray-100 cursor-pointer ${
                          n.isRead ? "bg-gray-200" : "bg-white"
                        }`}
                      >
                        <p className="font-semibold text-sm">
                          {n.isRead ? (
                            "Thông báo cũ"
                          ) : (
                            <strong className="text-blue-500">
                              Thông báo mới
                            </strong>
                          )}
                        </p>
                        <p className="text-xs text-gray-700">{n.text}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="text-center p-2 border-t bg-white">
                  <button
                    onClick={markAllAsRead}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Đánh dấu tất cả đã đọc
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {token ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img
              className="w-7 md:w-10 rounded-full"
              src={userData.image}
              alt=""
            />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 hidden group-hover:block">
              <div className="min-w-48 round flex flex-col gap-2 p-4 bg-gray-50 font-bold text-black">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:bg-blue-400 hover:text-white px-2 py-2 cursor-pointer"
                >
                  Trang cá nhân
                </p>
                <p
                  onClick={() => navigate("/comments")}
                  className="hover:bg-blue-400 hover:text-white px-2 py-2 cursor-pointer"
                >
                  Bình luận của tôi
                </p>
                <p
                  onClick={deleteToken}
                  className="hover:bg-blue-400 hover:text-white px-2 py-2 cursor-pointer"
                >
                  Đăng xuất
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-4 py-2 md:px-8 md:py-3 rounded-full font-bold md:block sm:block text-xs md:text-md"
          >
            Đăng nhập
          </button>
        )}
      </div>

      {showDetailModal && selectedNotification && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-md p-6 w-[600px] h-auto max-w-full shadow-lg relative">
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              ✕
            </button>
            <h2 className="text-3xl font-bold mb-5">Chi tiết thông báo</h2>
            <p className="text-lg mb-1">
              <strong>ID:</strong> {selectedNotification._id}
            </p>
            <p className="text-lg mb-1">
              <strong>Người nhận:</strong> Bạn
            </p>
            <p className="text-lg mb-1">
              <strong>Gửi bởi:</strong> Quản trị viên
            </p>
            <p className="text-lg mb-1 text-red-500">
              <strong>Nội dung:</strong> {selectedNotification.text}
            </p>
            <p className="text-lg">
              <strong>Thời gian:</strong>{" "}
              {new Date(selectedNotification.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
