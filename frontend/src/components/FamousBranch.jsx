import React from "react";
import { useNavigate } from "react-router-dom";
import { branch } from "../assets/assets";

const FamousBranch = () => {
  const navigate = useNavigate(); // Khởi tạo useNavigate

  // Hàm điều hướng với state là brand
  const handleNavigate = (brand) => {
    localStorage.setItem("brand", brand);
    navigate("/products");
  };

  return (
    <div
      className="flex flex-col items-center gap-4 py-16 text-black"
      id="type"
    >
      <h1 className="text-bold text-3xl font-medium">
        Tìm thiết bị của bạn với các thương hiệu nổi tiếng
      </h1>
      <p className="sm:w-1/3 text-center text-sm">
        Giúp bạn yên tâm lựa chọn sản phẩm từ những thương hiệu uy tín nhất
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-5 w-full place-content-center">
        {branch.map((item, index) => (
          <div
            key={index}
            className="h-40 flex flex-col justify-between items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
            onClick={() => {
              handleNavigate(item.name);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="flex-grow flex items-center justify-center">
              <img
                className="w-16 sm:w-24 max-h-20 object-contain"
                src={item.image}
                alt=""
              />
            </div>
            <p className="text-center mt-2">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamousBranch;
