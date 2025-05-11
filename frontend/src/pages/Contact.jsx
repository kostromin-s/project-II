import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();
  return (
    <div>
      {/* Phần bên trái là ảnh */}
      <div className="text-center text-2xl pt-10 text-gray-500">
        <b>LIÊN HỆ VỚI CHÚNG TÔI</b>
      </div>
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        <div>
          <img
            className="w-full md:max-w-[480px]"
            src={assets.contact_us}
            alt=""
          />
        </div>
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="flex flex-col justify-center font-semibold">
            Văn phòng của chúng tôi
          </p>
          <p className="text-gray-600">
            1 Đại Cồ Việt, Hai Bà Trưng
            <br />
            Hà Nội, Việt Nam
          </p>
          <p className="text-gray-600">
            Điện thoại: (84) 961215936
            <br />
            Email:{" "}
            <a
              href="mailto:namly6702@gmail.com"
              className="text-primary hover:underline"
            >
              namly6702@gmail.com
            </a>
          </p>
          <p className="flex flex-col justify-center font-semibold">
            Cơ hội nghề nghiệp
          </p>
          <p className="text-gray-600">
            Tìm hiểu thêm về các nhóm và vị trí tuyển dụng của chúng tôi.
          </p>
          <button
            onClick={() => navigate("/jobs")}
            className="bg-gray-200 text-gray-800 border-1 px-4 py-2 rounded transition-transform duration-300 hover:bg-primary hover:text-white hover:scale-110"
          >
            Khám phá công việc
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
