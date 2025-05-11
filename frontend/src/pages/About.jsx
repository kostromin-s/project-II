import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-center text-3xl pt-10 text-gray-500 mb-12">
        <p>
          Về{" "}
          <span className="text-gray-500 font-medium text-3xl">Chúng Tôi</span>
        </p>
      </div>
      <div className="my-19 flex flex-col md:flex-row gap-12 ">
        <img className="w-full md:max-w-[360px]" src={assets.about} alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-black ">
          <p>
            Chào mừng bạn đến với website của chúng tôi – điểm đến đáng tin cậy
            cho các sản phẩm và phụ kiện công nghệ chất lượng cao. Tại Group26,
            chúng tôi hiểu tầm quan trọng của việc luôn kết nối và sở hữu công
            nghệ mới nhất, cho dù là phục vụ công việc, giải trí hay nhu cầu
            hằng ngày.
          </p>
          <p>
            HNshop cam kết mang lại sự hoàn hảo trong lĩnh vực bán lẻ công nghệ.
            Chúng tôi liên tục cập nhật danh mục sản phẩm, mang đến các thiết bị
            và sáng tạo mới nhất nhằm nâng cao trải nghiệm kỹ thuật số của bạn.
            Dù bạn đang nâng cấp thiết bị hay tìm kiếm món quà hoàn hảo, chúng
            tôi luôn sẵn sàng đồng hành cùng bạn trong từng lựa chọn.
          </p>
          <b className="text-black">Tầm Nhìn Của Chúng Tôi</b>
          <p>
            Tầm nhìn của chúng tôi là giúp công nghệ trở nên dễ tiếp cận và thú
            vị hơn với tất cả mọi người. Chúng tôi nỗ lực thu hẹp khoảng cách
            giữa con người và các thiết bị giúp cuộc sống trở nên đơn giản hơn,
            thông qua việc cung cấp lời khuyên chuyên môn và các sản phẩm đáng
            tin cậy phù hợp với nhu cầu của bạn, mọi lúc mọi nơi.
          </p>
        </div>
      </div>
      <div className="text-xl my-4 mt-12 mb-8 justify-center relative flex">
        <p>
          TẠI SAO{" "}
          <span className="text-black font-semibold">CHỌN CHÚNG TÔI</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center p-10 border rounded shadow gap-4 bg-primary text-white">
        <div>
          <b>Hiệu quả:</b>
          <p>
            Duyệt sản phẩm nhanh chóng và tiện lợi, giúp bạn dễ dàng tìm thấy
            thiết bị phù hợp với nhu cầu.
          </p>
        </div>
        <div>
          <b>Tiện lợi:</b>
          <p>
            Mua sắm các sản phẩm công nghệ mới nhất mọi lúc, mọi nơi, với dịch
            vụ giao hàng nhanh chóng và đáng tin cậy.
          </p>
        </div>
        <div>
          <b>Cá nhân hóa:</b>
          <p>
            Gợi ý được tùy chỉnh giúp bạn khám phá các thiết bị phù hợp nhất với
            phong cách sống của mình.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
