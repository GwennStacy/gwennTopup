const token = "8866210500:AAHbs7hZRgl_EzJWa2kzgBTzG0Jv_Cxybmw";
const chatId = "1273987367";

async function send() {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: "✅ <b>Gwennn Topup System</b>\n\nYour Telegram Bot has been successfully connected! You will now receive notifications here when a customer makes a purchase.",
      parse_mode: "HTML",
    }),
  });
  console.log(await res.json());
}
send();
