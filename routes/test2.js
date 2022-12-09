const ecpay_payment = require("./../node_modules/ecpay_aio_nodejs/lib/ecpay_payment");
//參數值為[PLEASE MODIFY]者，請在每次測試時給予獨特值
//若要測試非必帶參數請將base_param內註解的參數依需求取消註解 //
let base_param = {
  MerchantTradeNo: "ECPAY237892173123", //請帶20碼uid, ex: f0a0d7e9fae1bb72bc93
  MerchantTradeDate: "2022/12/07 01:02:52", //ex: 2017/02/13 15:45:30
  TotalAmount: "100",
  TradeDesc: "測試交易描述",
  ItemName: "測試商品等",
  ReturnURL: "http://localhost:3000/cart/success",
  // ChooseSubPayment: '',
  // OrderResultURL: 'http://192.168.0.1/payment_result',
  // NeedExtraPaidInfo: '1',
  // ClientBackURL: 'https://www.google.com',
  // ItemURL: 'http://item.test.tw',
  // Remark: '交易備註',
  // HoldTradeAMT: '1',
  // StoreID: '',
  // CustomField1: '',
  // CustomField2: '',
  // CustomField3: '',
  // CustomField4: ''
};

const options = require("./../node_modules/ecpay_aio_nodejs/conf/config-example"),
  create = new ecpay_payment(options),
  htm = create.payment_client.aio_check_out_credit_onetime(
    (parameters = base_param)
  );
console.log(htm);
