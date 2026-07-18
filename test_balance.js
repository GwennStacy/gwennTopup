const G2BULK_API_KEY = "179ea8d1d441638e6faa5ea96ec9517f2c93388b12190b24d56b7c7dfb3eb282";

async function checkBalance() {
  const params = new URLSearchParams({
    key: G2BULK_API_KEY,
    action: "balance"
  });
  
  const response = await fetch("https://api.g2bulk.com/api/v2", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  
  const data = await response.json();
  console.log("Balance Response:", data);
}
checkBalance();
