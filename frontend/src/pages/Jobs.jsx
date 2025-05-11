import React from "react";
import { useNavigate } from "react-router-dom";

const Jobs = () => {
  const navigate = useNavigate();
  const jobs = [
    { title: "Kế toán", location: "Hà Nội, Việt Nam", number: 2 },
    { title: "Thu ngân", location: "TP. Hồ Chí Minh, Việt Nam", number: 3 },
    { title: "Quản lý kho", location: "Đà Nẵng, Việt Nam", number: 1 },
    { title: "Nhân viên bán hàng", location: "Cần Thơ, Việt Nam", number: 0 },
    { title: "Hỗ trợ khách hàng", location: "Hải Phòng, Việt Nam", number: 2 },
  ];
  return (
    <div className="min-h-screen bg-gray-100 p-10 ">
      <h1 className="text-3xl font-bold text-center mb-12 mt-6">Tuyển dụng</h1>
      <div className="bg-white shadow-lg rounded-lg mb-8 sm:mb-4">
        <div className="divide-y divide-gray-200">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="p-4 hover:bg-blue-100 transition-colors duration-300 grid grid-cols-[6fr_1fr]"
            >
              <div>
                <h2 className="text-sm md:text-xl font-semibold">
                  {job.title}
                </h2>
                <p className="text-gray-600 text-xs md:text-sm">
                  {job.location}
                </p>
              </div>
              <div className="mt-2 text-sm md:text-md">
                Số lượng: {job.number}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => navigate("/contact")}
          className="flex justify-center p-5 m-5 bg-white text-black hover:bg-primary hover:text-white rounded-lg transition-transform duration-300 hover:scale-110 text-sm md:text-lg"
        >
          Liên hệ tuyển dụng
        </button>
      </div>
    </div>
  );
};

export default Jobs;
