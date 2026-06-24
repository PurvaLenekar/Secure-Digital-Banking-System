const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use the stable model ID: "gemini-3.5-flash"
// Use the current stable and available model
const MODEL_NAME = "gemini-1.5-flash";

async function getSpendingInsights(transactions) {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const summary = transactions.map(t => `${t.description || t.type}: ${t.amount}`).join(", ");

    const prompt = `Analyze these recent transactions: ${summary}. 
                    Provide 3 very short, actionable financial tips in a friendly tone.
                    Return ONLY a raw JSON array of strings. Do not include markdown or explanations.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("AI Service Error:", error);
    return [
      "Keep tracking your spending to hit your goals!",
      "Consider setting aside a small amount for savings.",
      "Review your recent categories to identify unnecessary expenses."
    ];
  }
};

const checkFraud = async (newAmount, recentLedgerEntries, category) => {
  console.log("--- FRAUD CHECK DEBUG ---");
  
  const debitsOnly = recentLedgerEntries.filter(t => t.type === 'DEBIT');
  const normalSpending = debitsOnly.filter(t => t.amount < 10000);
  
  if (normalSpending.length < 3) return { isSuspicious: false };

  const total = normalSpending.reduce((sum, t) => sum + t.amount, 0);
  const avg = total / normalSpending.length;

  // Only run AI if the amount is actually significantly higher than average
  if (newAmount > (avg * 2)) {
    try {
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      const prompt = `
        Analyze this transaction for fraud risk:
        - Avg Spending: ₹${avg.toFixed(2)}
        - Current Amount: ₹${newAmount}
        - Category: ${category}
        - Hour of Day: ${new Date().getHours()}
        
        Instructions:
        1. If this transaction is out of character, return a short, urgent security warning.
        2. If consistent, return ONLY the word 'SAFE'.
        3. Do not include any other text or markdown.
      `;
      
      const result = await model.generateContent(prompt);
      const aiResponse = result.response.text().trim();

      if (aiResponse === 'SAFE') {
        return { isSuspicious: false };
      } else {
        return { isSuspicious: true, warning: aiResponse };
      }
    } catch (aiError) {
      console.error("AI Fraud Detection Error:", aiError.message);
      // Fallback: If AI fails, block the transaction for safety
      return { isSuspicious: true, warning: "Security Alert: Transaction flagged due to unusual amount." };
    }
  }

  return { isSuspicious: false };
}; 

module.exports = { getSpendingInsights , checkFraud };