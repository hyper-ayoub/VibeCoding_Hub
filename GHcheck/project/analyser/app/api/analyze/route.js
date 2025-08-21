import { NextResponse } from "next/server"

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

export async function POST(request) {
  try {
    const profileData = await request.json()

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              'You are an expert GitHub profile evaluator. Provide a detailed professional analysis and a score out of 100. Also analyze the commit activity patterns and provide specific insights about their development journey. Format your response as JSON with "analysis", "score", "suggestions", and "commitInsights" fields. The commitInsights should be an array of 3-5 short, actionable insights about their coding patterns, consistency, and growth trajectory.',
          },
          {
            role: "user",
            content: JSON.stringify(profileData),
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("DeepSeek API Error:", response.status, errorText)

      if (response.status === 402) {
        return NextResponse.json(
          {
            error: "API_BALANCE_INSUFFICIENT",
            message: "The DeepSeek API key has insufficient balance. Please add credits to your DeepSeek account.",
          },
          { status: 402 },
        )
      }

      if (response.status === 401) {
        return NextResponse.json(
          {
            error: "API_KEY_INVALID",
            message: "Invalid API key. Please check your DeepSeek API configuration.",
          },
          { status: 401 },
        )
      }

      return NextResponse.json(
        {
          error: "API_REQUEST_FAILED",
          message: `DeepSeek API request failed with status ${response.status}`,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    try {
      const parsedResponse = JSON.parse(aiResponse)
      return NextResponse.json(parsedResponse)
    } catch {
      return NextResponse.json({
        analysis: aiResponse,
        score: 75,
        suggestions: "Continue building great projects!",
        commitInsights: [
          "🚀 Shows consistent development activity",
          "📈 Good project creation pace",
          "⭐ Building projects with community value",
        ],
      })
    }
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: `AI analysis failed: ${error.message}` }, { status: 500 })
  }
}
