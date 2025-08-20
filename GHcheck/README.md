# GHcheck 🐙

AI-powered GitHub profile evaluator that provides comprehensive analysis and professional scoring out of 100.

## What It Does

GHcheck analyzes GitHub profiles comprehensively by examining profile information, repositories, programming languages, and contribution patterns to provide developers with actionable insights and a professional score.

- Analyzes GitHub profile summary including bio, location, and follower count
- Counts and evaluates public repositories for quality and engagement
- Identifies top repositories based on stars, forks, and recent activity
- Determines primary programming languages from repository analysis
- Evaluates contribution consistency and patterns over the past year
- Provides personalized suggestions to improve profile quality and visibility

## Demo

![GHcheck Interface](https://github.com/user-attachments/assets/67d0a9da-ad3b-49f6-8080-55904fcf9cbb)

<img width="1912" height="1122" alt="screencapture-localhost-3000-2025-08-20-14_03_58" src="https://github.com/user-attachments/assets/100157bb-a6e4-45e9-ae81-205e88cecbee" />

## Installation

1. Clone the repository
```bash
git clone https://github.com/username/ghcheck.git
cd ghcheck
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

## Usage

1. Enter a GitHub username or profile URL in the input field
2. Click the analyze button to start the evaluation
3. Wait for the AI analysis to complete
4. Review your comprehensive profile report and score

The tool accepts various input formats:
- Username: `johndoe`
- Full URL: `https://github.com/johndoe`
- Partial URL: `github.com/johndoe`

## Example Output

```
GitHub Profile: johndoe
Bio: Full-stack developer | Building cool things
Location: San Francisco, CA
Public Repositories: 24
Followers: 156

Top Repositories:
• portfolio-site (⭐ 120) - React-based personal website
• api-server (⭐ 88) - Node.js REST API
• data-visualizer (⭐ 67) - Python data analysis tool

Main Languages: JavaScript (45%), Python (28%), TypeScript (15%), Go (12%)

12-month Contributions: 520 commits
Activity Level: Very Active
Contribution Streak: 45 days

Profile Score: 82/100

Suggestions:
• Add comprehensive README files to your repositories
• Include more descriptive commit messages
• Consider contributing to open source projects
• Add repository topics for better discoverability
```

## Technology Stack

- React with TypeScript for the frontend interface
-  CSS for responsive styling and modern design
- Deepseek API for fetching profile and repository data
- Custom AI analysis engine for intelligent scoring and suggestions
- Vite for fast development and optimized builds

## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests to help improve GHcheck.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is open source and available under the MIT License.
