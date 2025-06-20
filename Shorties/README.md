# Shorties - AI-Powered URL Shortener

## A smart and efficient URL shortening service built with Node.js, featuring AI capabilities for enhanced link management and security.

Shorties is more than just a URL shortener; it's an intelligent link management platform designed to provide clean, concise, and secure short links. Leveraging the power of Node.js for high performance and scalability, Shorties also integrates Artificial Intelligence to offer advanced features such as intelligent link categorization, spam detection, and potentially predictive analytics for link performance.

Whether you're looking to simplify long URLs for sharing on social media, track link engagement, or ensure the safety of your redirects, Shorties provides a robust and user-friendly solution.

## ✨ Features

### Core URL Shortening Capabilities:

* **Rapid URL Shortening:** Instantly convert long, cumbersome URLs into short, shareable links.

* **Custom Aliases:** Create personalized and memorable short links (e.g., `shorties.com/my-project`).

* **Redirection Management:** Seamlessly redirect users from the short link to the original destination.

* **Click Analytics (Basic):** Track the number of clicks on each short URL to monitor engagement.

* **Expiry Dates:** Set optional expiry dates for short links.

### 🧠 AI-Powered Enhancements:

* **Intelligent Link Categorization:** AI analyzes the content of the original URL (if accessible) to automatically tag and categorize links (e.g., "News", "E-commerce", "Blog Post").

* **Spam & Malicious Link Detection:** Employ AI models to identify and flag potentially harmful or spammy URLs before they are shortened, enhancing user safety.

* **Content Summarization (Future)::** Potentially generate a brief summary of the linked content for quick preview.

## 🛠️ Technologies Used

* **Backend:** Node.js, Express.js

* **Database:** MongoDB (or other NoSQL database for flexible data storage)

* **AI Integration:**

  * Natural Language Processing (NLP) libraries (e.g., `compromise`, `natural` for basic text analysis)

  * Machine Learning frameworks (e.g., TensorFlow.js for more complex models, if implemented)

  * Potentially external AI APIs for advanced functionalities (e.g., content analysis, sentiment analysis).

## 🤖 AI Integration Explained

Shorties integrates AI at the point of URL creation to provide additional intelligence about the links being shortened.

Upon receiving a `longUrl` for shortening:

1. **Content Fetching (Optional & Safe):** The system may attempt to fetch metadata or a small snippet of the content from the `longUrl`. This process is designed to be rate-limited and robust, with mechanisms to prevent abuse and protect privacy.

2. **Text Analysis:** The fetched content (or the URL itself, if content fetching is not possible/desired) is passed to an AI model.

3. **Categorization:** The AI classifies the link into predefined categories (e.g., "News", "Sports", "Technology", "Education") based on its content. This helps in organizing and searching for links.

4. **Spam/Malware Check:** A separate AI model evaluates the URL and its potential content against known patterns of spam, phishing, or malware. If a link is deemed suspicious, it can be flagged, quarantined, or even rejected, adding a layer of security for users.

This AI layer transforms Shorties from a simple utility into an intelligent assistant for link management, helping users understand and trust the links they create and share.

## 🙌 Contributing

We welcome contributions! If you have suggestions for improvements, new features, or bug fixes, please open an issue or submit a pull request.

1. Fork the repository.

2. Create a new branch (`git checkout -b feature/your-feature-name`).

3. Make your changes.

4. Commit your changes (`git commit -m 'feat: Add new feature X'`).

5. Push to the branch (`git push origin feature/your-feature-name`).

6. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.
