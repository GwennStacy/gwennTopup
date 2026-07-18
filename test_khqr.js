const crypto = require('crypto');
async function run() {
  const secret = '5DZq745PvGy1h1bzISImPC7PQMHPHzkX';
  const profile = '5naBW0cACcdMewjeavsGmbvR9Fvv0PAz';
  const orderId = 'GWN-12345678';
  const amount = '0.78';
  const webhook_url = 'http://localhost:3000/api/webhooks/khqr';
  const remark = 'Topup Mobile Legends - 322485725 (3625)';
  
  const khqrApiUrl = `https://khqr.cc/api/${profile}/payment-gateway/v1/payments/qr-api-khqrcc`;
  const hashString = secret + orderId + amount + webhook_url + remark;
  const hash = crypto.createHash('sha1').update(hashString).digest('hex');

  const params = new URLSearchParams({
    transaction_id: orderId,
    amount: amount,
    success_url: webhook_url,
    remark: remark,
    hash: hash
  });

  const response = await fetch(khqrApiUrl, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0'
    },
    body: params.toString(),
  });

  const text = await response.text();
  console.log('Response:', text);
}
run();
