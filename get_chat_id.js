const token = process.env.TELEGRAM_BOT_TOKEN || process.argv[2];

if (!token) {
  console.log("Usage: node get_chat_id.js <YOUR_BOT_TOKEN>");
  process.exit(1);
}

async function getUpdates() {
  console.log(`Checking for messages sent to bot with token: ${token}`);
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
    const data = await res.json();
    
    if (!data.ok) {
      console.error("Error:", data.description);
      return;
    }
    
    if (data.result.length === 0) {
      console.log("No messages found. Please send a message (e.g. 'hello') to your bot in Telegram and try again.");
      return;
    }
    
    // Find the latest message
    const lastUpdate = data.result[data.result.length - 1];
    if (lastUpdate.message && lastUpdate.message.chat) {
      const chatId = lastUpdate.message.chat.id;
      const username = lastUpdate.message.chat.username || lastUpdate.message.chat.first_name;
      console.log("=========================================");
      console.log(`SUCCESS! Found Chat ID for ${username}`);
      console.log(`Your TELEGRAM_CHAT_ID is: ${chatId}`);
      console.log("=========================================");
    }
  } catch (e) {
    console.error("Fetch error:", e);
  }
}

getUpdates();
