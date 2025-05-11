import React from "react";

const Privacy = () => {
  return (
    <div class="max-w-4xl mx-auto p-6 bg-primary text-white shadow-lg rounded-lg mt-12">
      <h1 class="text-3xl font-bold mb-6 mt-6">Chính Sách Bảo Mật</h1>

      <p class="mb-4">
        Tại công ty của chúng tôi, chúng tôi cam kết bảo vệ quyền riêng tư của
        bạn. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng
        và bảo vệ thông tin cá nhân của bạn khi bạn truy cập trang web hoặc mua
        hàng từ cửa hàng của chúng tôi.
      </p>

      <h2 class="text-2xl font-semibold mb-4">Thông Tin Chúng Tôi Thu Thập</h2>
      <ul class="list-disc pl-6 mb-6">
        <li>
          Thông tin cá nhân (họ tên, địa chỉ email, số điện thoại, địa chỉ giao
          hàng)
        </li>
        <li>
          Chi tiết thanh toán (được xử lý an toàn thông qua các bên thứ ba)
        </li>
        <li>
          Thông tin thiết bị và trình duyệt (địa chỉ IP, loại trình duyệt,
          cookie)
        </li>
      </ul>

      <h2 class="text-2xl font-semibold mb-4">
        Cách Chúng Tôi Sử Dụng Thông Tin Của Bạn
      </h2>
      <p class="mb-4">Chúng tôi sử dụng thông tin của bạn để:</p>
      <ul class="list-disc pl-6 mb-6">
        <li>Xử lý và hoàn tất đơn hàng</li>
        <li>Cung cấp hỗ trợ khách hàng</li>
        <li>Cải thiện trang web và dịch vụ của chúng tôi</li>
        <li>Gửi email khuyến mãi (bạn có thể hủy đăng ký bất cứ lúc nào)</li>
      </ul>

      <h2 class="text-2xl font-semibold mb-4">Bảo Mật Dữ Liệu</h2>
      <p class="mb-6">
        Chúng tôi áp dụng các biện pháp bảo mật để bảo vệ dữ liệu cá nhân của
        bạn. Tuy nhiên, không có phương thức truyền tải nào qua internet là an
        toàn tuyệt đối, vì vậy chúng tôi không thể đảm bảo an toàn hoàn toàn.
      </p>

      <h2 class="text-2xl font-semibold mb-4">Quyền Lợi Của Bạn</h2>
      <p class="mb-6">
        Bạn có quyền truy cập, chỉnh sửa hoặc xóa thông tin cá nhân của mình.
        Nếu bạn muốn thực hiện các quyền này, vui lòng liên hệ với chúng tôi qua
        email:{" "}
        <a
          href="mailto:web262004@gmail.com"
          class="text-primary hover:underline"
        >
          web2620042004@gmail.com
        </a>
      </p>

      <h2 class="text-2xl font-semibold mb-4">Thay Đổi Chính Sách</h2>
      <p class="mb-6">
        Chúng tôi có thể cập nhật Chính Sách Bảo Mật này theo thời gian. Mọi
        thay đổi sẽ được đăng tải tại trang này, vì vậy vui lòng xem lại định
        kỳ.
      </p>

      <p class="text-red-200 mb-8">Cập nhật lần cuối: Tháng 5 năm 2025</p>
    </div>
  );
};

export default Privacy;
