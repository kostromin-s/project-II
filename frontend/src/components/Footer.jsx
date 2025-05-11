import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[4fr_1fr_2fr] gap-14 my-10 mt-40 text-sm">
        {/*left*/}
        <div>
          <img className="mb-5 w-56" src={assets.logo} alt="" />
          <p className="w-full md:2/3 text-gray-600 leading-6">
            Công ty chúng tôi chuyên cung cấp các thiết bị công nghệ mới nhất
            với giá cả cạnh tranh. Hệ thống bán hàng và bảo hành chất lượng của
            chúng tôi là lựa chọn hàng đầu cho việc mua sắm thiết bị công nghệ
            trực tuyến.
          </p>
        </div>
        {/*center*/}
        <div>
          <p className="text-xl font-medium mb-5">Công ty</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li
              className="hover:cursor-pointer hover:underline"
              onClick={() => {
                navigate("/");
                scrollTo(0, 0);
              }}
            >
              Trang chủ
            </li>
            <li
              className="hover:cursor-pointer hover:underline"
              onClick={() => {
                navigate("/about");
                scrollTo(0, 0);
              }}
            >
              Giới thiệu
            </li>
            <li
              className="hover:cursor-pointer hover:underline"
              onClick={() => {
                navigate("/contact");
                scrollTo(0, 0);
              }}
            >
              Liên hệ
            </li>
            <li
              className="hover:cursor-pointer hover:underline"
              onClick={() => {
                navigate("/privacy");
                scrollTo(0, 0);
              }}
            >
              Chính sách bảo mật
            </li>
            <li
              className="hover:cursor-pointer hover:underline"
              onClick={() => {
                navigate("/jobs");
                scrollTo(0, 0);
              }}
            >
              Cơ hội việc làm
            </li>
          </ul>
        </div>
        {/*right*/}
        <div>
          <p className="text-xl font-medium mb-5">LIÊN HỆ</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Số điện thoại: +84 961215936</li>
            <li>
              Gmail-1:{" "}
              <a
                href="mailto:namly6702@gmail.com"
                class="text-primary hover:underline"
              >
                namly6702@gmail.com
              </a>
            </li>
            <li>
              Gmail-2:{" "}
              <a
                href="mailto:hnshop@gmail.com"
                class="text-primary hover:underline"
              >
                hnshop@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center">Copyright © 2025</p>
      </div>
    </div>
  );
};

export default Footer;
