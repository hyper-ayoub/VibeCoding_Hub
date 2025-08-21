"use client"

import { useState } from "react"
import QRCode from "react-qr-code";


const GHcheck = () => {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [analysisData, setAnalysisData] = useState(null)

  const extractUsername = (input) => {
    const urlRegex = /github\.com\/([^/?#]+)/
    const match = input.match(urlRegex)
    return match ? match[1] : input.trim()
  }

  const fetchGitHubData = async (username) => {
    try {
      // Fetch user profile
      const userResponse = await fetch(`https://api.github.com/users/${username}`)
      if (!userResponse.ok) {
        throw new Error("User not found")
      }
      const userData = await userResponse.json()

      // Fetch repositories
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
      const reposData = await reposResponse.json()

      // Process repositories
      const topRepos = reposData
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 3)
        .map((repo) => ({
          name: repo.name,
          stars: repo.stargazers_count,
          url: repo.html_url,
        }))

      // Count languages
      const languages = {}
      reposData.forEach((repo) => {
        if (repo.language) {
          languages[repo.language] = (languages[repo.language] || 0) + 1
        }
      })

      const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0)

      const reposByYear = {}
      reposData.forEach((repo) => {
        const year = new Date(repo.created_at).getFullYear()
        if (!reposByYear[year]) {
          reposByYear[year] = { count: 0, stars: 0, forks: 0 }
        }
        reposByYear[year].count++
        reposByYear[year].stars += repo.stargazers_count
        reposByYear[year].forks += repo.forks_count
      })

      return {
        username: userData.login,
        profileUrl: userData.html_url,
        bio: userData.bio || "No bio available",
        location: userData.location || "Location not specified",
        avatarUrl: userData.avatar_url,
        publicRepos: userData.public_repos,
        followers: userData.followers,
        createdAt: userData.created_at,
        topRepos,
        languages: Object.keys(languages).slice(0, 5),
        totalStars,
        reposByYear, // Added repository data by year
      }
    } catch (error) {
      throw new Error(`Failed to fetch GitHub data: ${error.message}`)
    }
  }

  const generateFallbackAnalysis = (profileData) => {
    let score = 50 // Base score

    // Score based on repositories
    if (profileData.publicRepos > 20) score += 15
    else if (profileData.publicRepos > 10) score += 10
    else if (profileData.publicRepos > 5) score += 5

    // Score based on followers
    if (profileData.followers > 100) score += 15
    else if (profileData.followers > 50) score += 10
    else if (profileData.followers > 10) score += 5

    // Score based on stars
    if (profileData.totalStars > 100) score += 15
    else if (profileData.totalStars > 50) score += 10
    else if (profileData.totalStars > 10) score += 5

    // Score based on bio and location
    if (profileData.bio !== "No bio available") score += 5
    if (profileData.location !== "Location not specified") score += 5

    const analysis = `This GitHub profile shows ${profileData.publicRepos} public repositories with ${profileData.totalStars} total stars and ${profileData.followers} followers. The profile demonstrates activity across ${profileData.languages.length} programming languages including ${profileData.languages.slice(0, 3).join(", ")}. ${profileData.topRepos.length > 0 ? `Notable repositories include ${profileData.topRepos[0].name} with ${profileData.topRepos[0].stars} stars.` : ""}`

    const suggestions =
      score > 75
        ? "Excellent profile! Continue contributing to open source and sharing your knowledge."
        : score > 50
          ? "Good foundation! Consider adding more detailed project descriptions and contributing to more repositories."
          : "Great start! Focus on creating more repositories, adding detailed READMEs, and engaging with the community."

    return {
      analysis,
      score: Math.min(score, 100),
      suggestions,
      isAiGenerated: false,
      achievements: generateAchievements(profileData),
    }
  }

  const generateAchievements = (profileData) => {
    const achievements = []
    const currentYear = new Date().getFullYear()
    const createdYear = new Date(profileData.createdAt).getFullYear()
    const accountAge = currentYear - createdYear

    // Account age achievements
    if (accountAge >= 5) {
      achievements.push({
        title: "Veteran Developer",
        description: "GitHub account active for 5+ years",
        icon: "🏆",
        color: "bg-yellow-500",
        earned: true,
      })
    } else if (accountAge >= 2) {
      achievements.push({
        title: "Established Developer",
        description: "GitHub account active for 2+ years",
        icon: "🎖️",
        color: "bg-blue-500",
        earned: true,
      })
    }

    // Repository achievements
    if (profileData.publicRepos >= 50) {
      achievements.push({
        title: "Repository Master",
        description: "Created 50+ public repositories",
        icon: "📚",
        color: "bg-purple-500",
        earned: true,
      })
    } else if (profileData.publicRepos >= 20) {
      achievements.push({
        title: "Active Creator",
        description: "Created 20+ public repositories",
        icon: "🔨",
        color: "bg-green-500",
        earned: true,
      })
    } else if (profileData.publicRepos >= 10) {
      achievements.push({
        title: "Project Builder",
        description: "Created 10+ public repositories",
        icon: "🏗️",
        color: "bg-orange-500",
        earned: true,
      })
    }

    // Star achievements
    if (profileData.totalStars >= 1000) {
      achievements.push({
        title: "Star Collector",
        description: "Earned 1000+ total stars",
        icon: "⭐",
        color: "bg-yellow-400",
        earned: true,
      })
    } else if (profileData.totalStars >= 100) {
      achievements.push({
        title: "Rising Star",
        description: "Earned 100+ total stars",
        icon: "🌟",
        color: "bg-indigo-500",
        earned: true,
      })
    } else if (profileData.totalStars >= 10) {
      achievements.push({
        title: "First Stars",
        description: "Earned 10+ total stars",
        icon: "✨",
        color: "bg-pink-500",
        earned: true,
      })
    }

    // Follower achievements
    if (profileData.followers >= 500) {
      achievements.push({
        title: "Community Leader",
        description: "500+ followers",
        icon: "👑",
        color: "bg-red-500",
        earned: true,
      })
    } else if (profileData.followers >= 100) {
      achievements.push({
        title: "Influencer",
        description: "100+ followers",
        icon: "📢",
        color: "bg-cyan-500",
        earned: true,
      })
    } else if (profileData.followers >= 25) {
      achievements.push({
        title: "Growing Network",
        description: "25+ followers",
        icon: "🤝",
        color: "bg-teal-500",
        earned: true,
      })
    }

    // Language diversity achievement
    if (profileData.languages.length >= 5) {
      achievements.push({
        title: "Polyglot Programmer",
        description: "Uses 5+ programming languages",
        icon: "🌐",
        color: "bg-emerald-500",
        earned: true,
      })
    } else if (profileData.languages.length >= 3) {
      achievements.push({
        title: "Multi-Language Developer",
        description: "Uses 3+ programming languages",
        icon: "💻",
        color: "bg-lime-500",
        earned: true,
      })
    }

    // Profile completeness achievement
    if (profileData.bio !== "No bio available" && profileData.location !== "Location not specified") {
      achievements.push({
        title: "Complete Profile",
        description: "Has bio and location filled",
        icon: "📝",
        color: "bg-slate-500",
        earned: true,
      })
    }

    // Popular repository achievement
    const topRepo = profileData.topRepos[0]
    if (topRepo && topRepo.stars >= 50) {
      achievements.push({
        title: "Popular Project",
        description: `${topRepo.name} has 50+ stars`,
        icon: "🚀",
        color: "bg-violet-500",
        earned: true,
      })
    }

    return achievements
  }

  const analyzeWithDeepSeek = async (profileData) => {
    try {
      const enhancedProfileData = {
        ...profileData,
        commitActivity: generateCommitActivityData(profileData), // Add commit activity data for AI analysis
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enhancedProfileData),
      })

      if (!response.ok) {
        const errorData = await response.json()

        if (response.status === 402 && errorData.error === "API_BALANCE_INSUFFICIENT") {
          console.warn("DeepSeek API balance insufficient, using fallback analysis")
          return {
            ...generateFallbackAnalysis(profileData),
            commitInsights: generateFallbackCommitInsights(profileData), // Added fallback commit insights
            apiError: "AI analysis unavailable due to insufficient API balance. Using basic analysis instead.",
          }
        }

        if (response.status === 401 && errorData.error === "API_KEY_INVALID") {
          console.warn("DeepSeek API key invalid, using fallback analysis")
          return {
            ...generateFallbackAnalysis(profileData),
            commitInsights: generateFallbackCommitInsights(profileData), // Added fallback commit insights
            apiError: "AI analysis unavailable due to invalid API key. Using basic analysis instead.",
          }
        }

        throw new Error(errorData.message || "Analysis request failed")
      }

      const result = await response.json()
      return {
        ...result,
        isAiGenerated: true,
        achievements: result.achievements || generateAchievements(profileData),
      }
    } catch (error) {
      console.warn("AI analysis failed, using fallback:", error.message)
      return {
        ...generateFallbackAnalysis(profileData),
        commitInsights: generateFallbackCommitInsights(profileData), // Added fallback commit insights
        apiError: "AI analysis temporarily unavailable. Using basic analysis instead.",
      }
    }
  }

  const generateCommitActivityData = (profileData) => {
    const currentYear = new Date().getFullYear()
    const createdYear = new Date(profileData.createdAt).getFullYear()
    const accountAge = currentYear - createdYear

    const yearsToShow = Math.min(6, accountAge + 1)
    const startYear = Math.max(createdYear, currentYear - yearsToShow + 1)

    const years = []
    for (let year = startYear; year <= currentYear; year++) {
      const yearData = profileData.reposByYear[year] || { count: 0, stars: 0, forks: 0 }
      years.push({
        year,
        repos: yearData.count,
        stars: yearData.stars,
        forks: yearData.forks,
      })
    }

    return {
      accountAge,
      totalYears: yearsToShow,
      yearlyActivity: years,
      mostActiveYear: years.reduce((max, year) => (year.repos > max.repos ? year : max), years[0]),
      totalReposOverTime: years.reduce((sum, year) => sum + year.repos, 0),
    }
  }

  const generateFallbackCommitInsights = (profileData) => {
    const currentYear = new Date().getFullYear()
    const createdYear = new Date(profileData.createdAt).getFullYear()
    const accountAge = currentYear - createdYear

    const insights = []

    // Account age insight
    if (accountAge > 5) {
      insights.push("🏆 Veteran developer with long-term GitHub presence")
    } else if (accountAge > 2) {
      insights.push("📈 Established developer with consistent activity")
    } else {
      insights.push("🌱 Growing developer profile with recent activity")
    }

    // Repository activity insight
    const avgReposPerYear = profileData.publicRepos / Math.max(accountAge, 1)
    if (avgReposPerYear > 10) {
      insights.push("🚀 Highly productive with frequent project creation")
    } else if (avgReposPerYear > 5) {
      insights.push("⚡ Good project creation pace")
    } else {
      insights.push("🎯 Focused approach with selective project creation")
    }

    // Stars insight
    if (profileData.totalStars > 100) {
      insights.push("⭐ Creates valuable projects that attract community attention")
    } else if (profileData.totalStars > 10) {
      insights.push("👍 Building projects with community recognition")
    }

    return insights
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    setError("")

    try {
      const username = extractUsername(input)
      const profileData = await fetchGitHubData(username)
      const aiAnalysis = await analyzeWithDeepSeek(profileData)

      setAnalysisData({
        ...profileData,
        ...aiAnalysis,
      })
      setShowModal(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setAnalysisData(null)
  }

  const generateQRData = () => {
    if (!analysisData) return ""
    const currentDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    return `GitHub Profile: ${analysisData.username}\nURL: ${analysisData.profileUrl}\nScore: ${analysisData.score}/100\nLanguages: ${analysisData.languages.join(", ")}\nScanned: ${currentDate}`
  }

  const ScoreCircle = ({ score }) => {
    const circumference = 2 * Math.PI * 45
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (score / 100) * circumference

    return (
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" stroke="rgb(var(--border))" strokeWidth="8" fill="none" />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="rgb(var(--chart-1))"
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{score}</span>
        </div>
      </div>
    )
  }

  const generateCommitActivity = () => {
    const currentYear = new Date().getFullYear()
    const createdYear = new Date(analysisData.createdAt).getFullYear()
    const accountAge = currentYear - createdYear

    // Show all years from account creation to current year, but limit display to reasonable amount
    const yearsToShow = Math.min(6, accountAge + 1)
    const startYear = Math.max(createdYear, currentYear - yearsToShow + 1)

    const years = []

    for (let year = startYear; year <= currentYear; year++) {
      const yearData = analysisData.reposByYear[year] || { count: 0, stars: 0, forks: 0 }

      let activityScore = 0

      // Base activity on repositories created that year
      activityScore += yearData.count * 15 // 15 points per repo

      // Add points for stars received on repos created that year
      activityScore += yearData.stars * 2 // 2 points per star

      // Add points for forks
      activityScore += yearData.forks * 3 // 3 points per fork

      // If no repos were created that year, but account existed, give minimal activity
      if (year >= createdYear && yearData.count === 0) {
        // Estimate some activity based on overall profile strength
        const profileStrength = analysisData.followers * 0.5 + analysisData.totalStars * 0.1
        activityScore = Math.max(5, profileStrength * 0.1)
      }

      // Convert to percentage (cap at 100%)
      const activityPercentage = Math.min(Math.round(activityScore), 100)

      let estimatedCommits = 0
      if (yearData.count > 0) {
        // If repos were created, estimate commits based on repo count and complexity
        estimatedCommits = yearData.count * 25 + yearData.stars * 2 + yearData.forks * 5
      } else if (activityPercentage > 0) {
        // Minimal commits for years with some activity but no new repos
        estimatedCommits = Math.round(activityPercentage * 1.5)
      }

      years.push({
        year,
        percentage: activityPercentage,
        commits: estimatedCommits,
        repos: yearData.count, // Added actual repo count for that year
        stars: yearData.stars, // Added actual stars for that year
      })
    }

    return years
  }

  const getActivityColor = (percentage) => {
    if (percentage >= 80) return "bg-green-600"
    if (percentage >= 60) return "bg-green-500"
    if (percentage >= 40) return "bg-green-400"
    if (percentage >= 20) return "bg-green-300"
    return "bg-green-200"
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-space-grotesk font-bold text-white mb-2 drop-shadow-lg">
            GitHub Profile Analyzer
          </h1>
          <p className="text-white/80 font-dm-sans drop-shadow">Discover insights about any GitHub profile</p>
        </div>

        <div className="glass-card rounded-xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter GitHub username or profile URL"
                className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground border border-white/20"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none group"
              style={{
                background: loading
                  ? "rgb(107, 114, 128)"
                  : "linear-gradient(135deg, rgb(147, 51, 234) 0%, rgb(59, 130, 246) 50%, rgb(6, 182, 212) 100%)",
              }}
              disabled={loading || !input.trim()}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>

              {loading ? (
                <div className="flex items-center justify-center gap-2 relative z-10">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing...
                </div>
              ) : (
                <span className="relative z-10 flex items-center justify-center gap-2 font-space-grotesk">
                  <svg
                    className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Analyze Profile
                </span>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 glass border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm font-dm-sans">{error}</p>
            </div>
          )}
        </div>
      </div>

      {showModal && analysisData && (
        /* Enhanced modal with glassmorphism and smooth animations */
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="glass-modal rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 zoom-in-95 duration-500">
            {/* Header */}
            <div className="sticky top-0 glass border-b border-white/10 p-6 flex items-center justify-between rounded-t-xl">
              <h2 className="text-2xl font-space-grotesk font-bold text-popover-foreground">
                Profile Analysis Results
              </h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Profile Header */}
              <div className="flex items-start gap-6">
                <img
                  src={analysisData.avatarUrl || "/placeholder.svg?height=80&width=80"}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full border-2 border-white/20 shadow-lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-space-grotesk font-semibold text-popover-foreground mb-2">
                    {analysisData.username}
                  </h3>
                  <p className="text-muted-foreground mb-2 font-dm-sans">{analysisData.bio}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-dm-sans">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {analysisData.location}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card rounded-lg p-6 text-center shadow-lg">
                  <div className="text-3xl font-space-grotesk font-bold text-chart-1 mb-2">
                    {analysisData.publicRepos}
                  </div>
                  <div className="text-sm text-muted-foreground font-dm-sans">Repositories</div>
                </div>
                <div className="glass-card rounded-lg p-6 text-center shadow-lg">
                  <div className="text-3xl font-space-grotesk font-bold text-chart-2 mb-2">
                    {analysisData.followers}
                  </div>
                  <div className="text-sm text-muted-foreground font-dm-sans">Followers</div>
                </div>
                <div className="glass-card rounded-lg p-6 text-center shadow-lg">
                  <div className="text-3xl font-space-grotesk font-bold text-chart-3 mb-2">
                    {analysisData.totalStars}
                  </div>
                  <div className="text-sm text-muted-foreground font-dm-sans">Total Stars</div>
                </div>
              </div>

              {/* Score Section */}
              <div className="glass-card rounded-lg p-6 shadow-lg">
                <div className="text-center">
                  <h3 className="text-lg font-space-grotesk font-semibold text-popover-foreground mb-4">
                    {analysisData.isAiGenerated ? "AI Analysis Score" : "Basic Analysis Score"}
                  </h3>
                  <ScoreCircle score={analysisData.score} />
                  <p className="text-muted-foreground font-dm-sans">Overall Profile Score</p>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Top Repositories */}
                  <div className="glass-card rounded-lg p-6 shadow-lg">
                    <h3 className="text-lg font-space-grotesk font-semibold text-popover-foreground mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Top Repositories
                    </h3>
                    <div className="space-y-3">
                      {analysisData.topRepos.map((repo, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:underline font-medium"
                          >
                            {repo.name}
                          </a>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {repo.stars}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Social Media Links */}
                  <div className="glass-card rounded-lg p-6 shadow-lg">
                    <h3 className="text-lg font-space-grotesk font-semibold text-popover-foreground mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Social Media Links
                    </h3>
                    <div className="space-y-3">
                      <a
                        href={analysisData.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                      >
                        <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-background" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">GitHub Profile</div>
                          <div className="text-sm text-muted-foreground">@{analysisData.username}</div>
                        </div>
                      </a>

                      <a
                        href={`https://twitter.com/${analysisData.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                      >
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Twitter/X</div>
                          <div className="text-sm text-muted-foreground">@{analysisData.username}</div>
                        </div>
                      </a>

                      <a
                        href={`https://linkedin.com/in/${analysisData.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                      >
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-foreground">LinkedIn</div>
                          <div className="text-sm text-muted-foreground">/in/{analysisData.username}</div>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* Commit Activity */}
                  <div className="glass-card rounded-lg p-6 shadow-lg">
                    <h3 className="text-lg font-space-grotesk font-semibold text-popover-foreground mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h-2a2 2 0 00-2-2z"
                        />
                      </svg>
                      Commit Activity
                    </h3>

                    {analysisData.commitInsights && (
                      <div className="mb-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                          AI Insights
                        </h4>
                        <div className="space-y-2">
                          {analysisData.commitInsights.map((insight, index) => (
                            <div key={index} className="text-sm text-card-foreground flex items-start gap-2">
                              <span className="text-accent">•</span>
                              <span>{insight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {generateCommitActivity().map((yearData, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-foreground">{yearData.year}</span>
                            <div className="text-right">
                              <div className="text-muted-foreground">
                                {yearData.percentage}% • {yearData.commits} commits
                              </div>
                              {yearData.repos > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  {yearData.repos} repos • {yearData.stars} stars
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-full ${getActivityColor(yearData.percentage)} transition-all duration-1000 ease-out rounded-full`}
                              style={{ width: `${yearData.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                        <span>Less</span>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
                          <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                          <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
                        </div>
                        <span>More</span>
                      </div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="glass-card rounded-lg p-6 shadow-lg">
                    <h3 className="text-lg font-space-grotesk font-semibold text-popover-foreground mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                      Main Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisData.languages.map((lang, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium border border-accent/20"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Analysis */}
                  <div className="glass-card rounded-lg p-6 shadow-lg">
                    <h3 className="text-lg font-space-grotesk font-semibold text-popover-foreground mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h-2a2 2 0 00-2-2z"
                        />
                      </svg>
                      Analysis
                    </h3>

                    <p className="text-card-foreground leading-relaxed mb-4 font-dm-sans">{analysisData.analysis}</p>

                    <div className="border-t border-white/10 pt-4">
                      <h4 className="font-space-grotesk font-semibold text-popover-foreground mb-2">Suggestions:</h4>
                      <p className="text-muted-foreground font-dm-sans">{analysisData.suggestions}</p>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="glass-card rounded-lg p-6 text-center shadow-lg">
                    <h3 className="text-lg font-space-grotesk font-semibold text-popover-foreground mb-4">
                      Profile QR Code
                    </h3>
                    <div className="inline-block p-4 bg-white rounded-lg">
                      <QRCode value={generateQRData()} size={120} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Scan to view profile details</p>
                  </div>

                  {/* Achievements */}
                  {analysisData.achievements && analysisData.achievements.length > 0 && (
                    <div className="glass-card rounded-lg p-6 shadow-lg">
                      <h3 className="text-lg font-space-grotesk font-semibold text-popover-foreground mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138z"
                          />
                        </svg>
                        Achievements
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {analysisData.achievements.map((achievement, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-4 p-4 rounded-lg border-2 ${
                              achievement.earned
                                ? "bg-accent/5 border-accent/20"
                                : "bg-muted/50 border-muted opacity-60"
                            }`}
                          >
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl ${achievement.color}`}
                            >
                              {achievement.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            </div>
                            {achievement.earned && (
                              <div className="text-accent">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GHcheck
