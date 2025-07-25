import CryptoJS from "crypto-js";
import axios from "axios";
import moment from "moment";
import config from "../config/zalopay.js";
import cartModel from "../models/cartModel.js";

const getMerchantBanks = async (req, res) => {
  const reqtime = Date.now();
  const mac = CryptoJS.HmacSHA256(
    `${config.app_id}|${reqtime}`,
    config.key1
  ).toString();
  const params = { app_id: config.app_id, reqtime, mac };

  try {
    const response = await axios.get(config.endpoint, { params });
    const banks = response.data.banks;

    for (const id in banks) {
      const bankList = banks[id];
      console.log(`${id}.`);
      for (const bank of bankList) {
        console.log(bank);
      }
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách ngân hàng đối tác:", error.message);
  }
};

const payCart = async (req, res) => {
  try {
    const { cart } = req.body;
    if (!cart)
      return res
        .status(400)
        .json({ success: false, message: "Chưa chọn giỏ hàng!" });
    const embed_data = {
      redirecturl: `${process.env.FE_URL}/mycart`,
    };

    const items = [
      {
        itemid: cart._id || 1,
        itemname: cart.itemData?.name || "Sản phẩm chưa đặt tên",
        itemprice: cart.itemData?.price || 0,
        itemquantity: cart.totalItems || 1,
      },
    ];

    const transID = Math.floor(Math.random() * 1000000);
    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`,
      app_user: cart.userData.name,
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: cart.totalPrice,
      description: `HNshop - Thanh toán đơn hàng #${transID} - ${cart.totalItems} sản phẩm ${cart.itemData.name}`,
      bank_code: "",
      callback_url: `${process.env.BE_URL}/api/user/callback`,
    };
    //theo dõi order
    console.log(
      "Dữ liệu order trước khi mã hóa MAC:\n",
      JSON.stringify(order, null, 2)
    );

    const data = [
      order.app_id,
      order.app_trans_id,
      order.app_user,
      order.amount,
      order.app_time,
      order.embed_data,
      order.item,
    ].join("|");

    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const response = await axios.post(config.endpoint, null, {
      params: order,
    });
    return res.json({ success: true, order_url: response.data.order_url }); // Gửi dữ liệu phản hồi về client
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Lỗi khi thanh toán", success: false });
  }
};

const callback = async (req, res) => {
  let result = {
    return_code: 1, // Mặc định là thành công
    return_message: "thành công",
  };

  try {
    const dataStr = req.body.data;
    const reqMac = req.body.mac;

    // Tính toán HMAC từ dữ liệu và key
    const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

    // Kiểm tra MAC
    if (reqMac !== mac) {
      result = {
        return_code: -1, // Lỗi: MAC không khớp
        return_message: "MAC không khớp",
      };
      console.log("MAC không khớp");
      return res.json(result); // Trả về kết quả lỗi ngay lập tức
    }

    // Trả về kết quả cho ZaloPay ngay lập tức
    res.json(result);

    // Xử lý phía sau (non-blocking)
    const dataJson = JSON.parse(dataStr);
    const items = JSON.parse(dataJson.item);
    const itemId = items[0]?.itemid;
    const macQuery = CryptoJS.HmacSHA256(
      `${dataJson.app_id}|${dataJson.app_trans_id}|${config.key1}`,
      config.key1
    ).toString();

    // Truy vấn trạng thái thanh toán từ ZaloPay
    const billStatus = await axios.post(
      "https://sb-openapi.zalopay.vn/v2/query",
      {
        app_trans_id: dataJson.app_trans_id,
        app_id: dataJson.app_id,
        mac: macQuery,
      }
    );
    console.log({
      app_trans_id: dataJson.app_trans_id,
      app_id: dataJson.app_id,
      mac: macQuery,
    });

    console.log("Trạng thái thanh toán:", billStatus.data);

    if (billStatus.data.return_code === 1) {
      // Thành công
      try {
        if (billStatus.data.return_code === 1) {
          await cartModel.findByIdAndUpdate(itemId, { paymentStatus: true });
          console.log("Cập nhật giỏ hàng thành công.");
        }
      } catch (err) {
        console.error("Lỗi khi cập nhật giỏ hàng:", err);
      }
    } else if (billStatus.data.return_code === 2) {
      console.log("Mã giao dịch bị trùng.");
    } else {
      console.log("Không phải callback hoặc trạng thái không hợp lệ.");
    }
  } catch (err) {
    console.error("Lỗi khi xử lý callback:", err);
    result = {
      return_code: 0, // Lỗi hệ thống
      return_message: "Lỗi hệ thống nội bộ",
    };
    return res.json(result); // Trả về lỗi nếu xảy ra ngoại lệ trong quá trình xử lý
  }
};

export { getMerchantBanks, payCart, callback };
