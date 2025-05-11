import React from "react";
import { assets } from "../assets/assets";
import { useState } from "react";

const Banner = () => {
  const images = [
    assets.herobanner,
    assets.banner1,
    assets.banner2,
    assets.banner3,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Slide ảnh có hiệu ứng trượt */}
      <div
        className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`banner-${idx}`}
            className="w-full h-screen object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* Overlay mờ */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-white/10 z-10"></div>

      {/* Nội dung text cố định, không bị trượt */}
      <div className="relative z-20 mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
        <div className="max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
          <h1 className="text-3xl font-extrabold sm:text-5xl text-black">
            Hãy để chúng tôi giúp bạn tìm ra
            <strong className="block font-extrabold text-primary">
              Thiết bị tốt nhất.
            </strong>
          </h1>

          <p className="mt-4 max-w-lg sm:text-xl/relaxed text-black ml-6">
            Sản phẩm của chúng tôi có chất lượng rất tốt, được sử dụng rộng rãi
            trên thị trường và chúng tôi là nhà phân phối sản phẩm uy tín hàng
            đầu.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 text-center">
            <a
              href="/products"
              className="ml-12 block w-full rounded-sm bg-primary px-12 py-3 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:ring-3 focus:outline-hidden sm:w-auto"
            >
              Bắt đầu ngay
            </a>

            <a
              href="/about"
              className="block w-full rounded-sm bg-white px-12 py-3 text-sm font-medium text-primary shadow-sm hover:text-white hover:bg-rose-700 focus:ring-3 focus:outline-hidden sm:w-auto"
            >
              Tìm hiểu thêm
            </a>
          </div>
        </div>
      </div>

      {/* Nút điều hướng */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-6 -translate-y-1/2 z-30 bg-white text-black p-3 rounded-full shadow-md hover:bg-gray-200 transition"
        aria-label="Previous Slide"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-6 -translate-y-1/2 z-30 bg-white text-black p-3 rounded-full shadow-md hover:bg-gray-200 transition"
        aria-label="Next Slide"
      >
        ›
      </button>
    </div>
  );
};

export default Banner;
