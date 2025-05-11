import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const { userData, setUserData, backendurl, token, getUserData, deleteUser } =
    useContext(AppContext);
  const [image, setImage] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  const updateProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", userData.address);
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      if (image) formData.append("image", image);

      const { data } = await axios.post(
        `${backendurl}/api/user/update-profile`,
        formData,
        {
          headers: { token },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await getUserData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setDeleting(true);
      await deleteUser();
      toast.success("Xóa tài khoản thành công!");
      toast.info("Đang chuyển hướng về trang chủ...");

      localStorage.removeItem("token");
      localStorage.clear();

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.log(err);
      toast.error("Xóa tài khoản thất bại.");
    } finally {
      setDeleting(false);
      setShowConfirmModal(false);
    }
  };

  return userData ? (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200 p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-10">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            {isEdit ? (
              <label htmlFor="image" className="relative group cursor-pointer">
                <img
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt="Ảnh đại diện"
                  className="w-36 h-36 rounded-full border-4 border-blue-400 object-cover group-hover:opacity-80"
                />
                <input
                  type="file"
                  id="image"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow">
                  <span className="text-blue-500 text-sm">📷</span>
                </div>
              </label>
            ) : (
              <img
                src={userData.image}
                alt="Ảnh đại diện"
                className="w-36 h-36 rounded-full border-4 border-gray-300 object-cover"
              />
            )}
          </div>

          {/* Name */}
          <div className="text-center mb-6">
            {isEdit ? (
              <input
                type="text"
                value={userData.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                className="text-2xl font-semibold text-center w-full border-b-2 focus:outline-none focus:border-blue-500"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-800">
                {userData.name}
              </h2>
            )}
            <p className="text-sm text-gray-500">{userData.email}</p>
          </div>

          {/* Info */}
          <div className="space-y-4 text-gray-700 text-sm">
            <div>
              <span className="font-medium">📞 Số điện thoại:</span>{" "}
              {isEdit ? (
                <input
                  type="text"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData({ ...userData, phone: e.target.value })
                  }
                  className="w-full border rounded-md p-2 mt-1"
                />
              ) : (
                <span className="ml-2">{userData.phone}</span>
              )}
            </div>

            <div>
              <span className="font-medium">📍 Địa chỉ:</span>{" "}
              {isEdit ? (
                <input
                  type="text"
                  value={userData.address}
                  onChange={(e) =>
                    setUserData({ ...userData, address: e.target.value })
                  }
                  className="w-full border rounded-md p-2 mt-1"
                />
              ) : (
                <span className="ml-2">{userData.address}</span>
              )}
            </div>

            <div>
              <span className="font-medium">⚧ Giới tính:</span>{" "}
              {isEdit ? (
                <select
                  value={userData.gender}
                  onChange={(e) =>
                    setUserData({ ...userData, gender: e.target.value })
                  }
                  className="w-full border rounded-md p-2 mt-1"
                >
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                </select>
              ) : (
                <span className="ml-2">
                  {userData.gender === "Male" ? "Nam" : "Nữ"}
                </span>
              )}
            </div>

            <div>
              <span className="font-medium">🎂 Ngày sinh:</span>{" "}
              {isEdit ? (
                <input
                  type="date"
                  value={userData.dob}
                  onChange={(e) =>
                    setUserData({ ...userData, dob: e.target.value })
                  }
                  className="w-full border rounded-md p-2 mt-1"
                />
              ) : (
                <span className="ml-2">{userData.dob}</span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex justify-center space-x-4">
              {isEdit ? (
                <>
                  <button
                    onClick={updateProfileData}
                    className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition"
                  >
                    💾 Lưu
                  </button>
                  <button
                    onClick={() => {
                      setIsEdit(false);
                      setImage(null);
                      getUserData();
                    }}
                    className="bg-gray-400 text-white px-5 py-2 rounded-full hover:bg-gray-500 transition"
                  >
                    ❌ Hủy
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEdit(true)}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition"
                >
                  ✏️ Chỉnh sửa hồ sơ
                </button>
              )}
            </div>

            {/* Delete Button */}
            <button
              onClick={() => setShowConfirmModal(true)}
              className="text-red-600 text-sm hover:underline mt-4 disabled:opacity-60"
              disabled={deleting}
            >
              {deleting ? "Đang xóa..." : "🗑️ Xóa tài khoản"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center space-y-4 w-80">
            <h3 className="text-lg font-semibold text-gray-800">
              ⚠️ Xác nhận xóa tài khoản
            </h3>
            <p className="text-gray-600">
              Bạn có chắc chắn muốn xóa tài khoản của mình không?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleDeleteUser}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Có, xóa
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : null;
};

export default MyProfile;
