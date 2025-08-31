#  InSighted 👔

<img width="823" height="303" alt="image-removebg-preview__1_-Picsart-AiImageEnhancer-removebg-preview" src="https://github.com/user-attachments/assets/2f57fbfb-8ec5-4cc9-9e6e-9d3397bfbd34" />

## **1\. Project Overview**

InSighted 👔 is an AI-powered tool that evaluates LinkedIn profiles and provides detailed analysis, professional scoring, and personalized improvement suggestions.

The goal is to help students, job seekers, and professionals optimize their LinkedIn presence and improve career opportunities.

This MVP is designed as a demo web app where users can input a LinkedIn profile URL, and receive a structured AI-generated report.

---

## **2\. Objectives**

* ✅ Analyze LinkedIn profiles for completeness & professionalism.  
* ✅ Provide a professional score (/100).  
* ✅ Offer personalized suggestions for improvement.  
* ✅ Build a demo web page to showcase the concept.  
* ✅ Validate idea through user testing & feedback.

---

## **3\. Key Features**

1. Profile Completeness Check  
   * Detects if photo, summary, experience, and skills are present.  
2. Professional Tone Evaluation  
   * Uses AI (OpenAI) to assess clarity, tone, and professionalism in summaries.  
3. Experience & Skills Review  
   * Evaluates relevance, endorsements, and missing areas.  
4. Connections & Activity Analysis  
   * Estimates network quality and engagement (connections, posting frequency).  
5. AI-Powered Scoring System  
   * Section-wise scoring \+ overall professional rating (/100).  
6. Personalized Recommendations  
   * Improvement suggestions tailored to the user’s profile.

---

## **4\. Tech Stack**

### **🔹 Frontend**

* React.js / Next.js (demo web app)  
* Tailwind CSS (UI styling)

### **🔹 Backend**

* Supabase Auth (sign up / log in)  
* Integration with PhantomBuster API (for LinkedIn data)  
* OpenAI API (for AI-powered evaluation)

### **🔹 APIs & Tools**

* PhantomBuster (phantombuster.com) – LinkedIn profile scraping  
* OpenAI API ([platform.openai.com](https://platform.openai.com/)) – AI analysis & suggestions

### **🔹 Deployment**

* Vercel (Frontend hosting)  
* Render / Railway / Heroku (Backend demo hosting)

---

## **5\. System Architecture**

```
┌─────────────────────────────────────────────────────────────┐
   User (Profile URL / Name)
           │
           ▼
   Frontend (Next.js)
           │
           ▼
Supabase Auth (sign up / log in)
           │
    ┌──────┴─────────┐
    ▼                ▼
PhantomBuster    OpenAI API
(Get profile)    (Analyze text, score, suggestions)
    │                │
    └──────┬─────────┘
           ▼
    Report Generator
           │
           ▼
   Frontend (UI Report)     
└─────────────────────────────────────────────────────────────┘
```

## **6\. Workflow**

1. User enters LinkedIn profile URL.  
2. Backend calls PhantomBuster API to extract profile data.  
3. Extracted data sent to OpenAI API for analysis.  
4. AI generates structured output:  
   * Scores  
   * Section insights  
   * Suggestions  
5. Backend returns final report → Frontend displays it.

---

## **7\. Example Output**

Profile: [https://linkedin.com/in/johndoe](https://linkedin.com/in/johndoe)

* Summary: Clear and well-written  
* Experience: Relevant and consistent  
* Skills: Missing technical endorsements  
* Connections: 350+  
* Activity: Moderate (1 post/month)

📊 Final Score: 74/100

📝 Suggestions:

* Add certifications  
* Highlight recent projects  
* Request endorsements for technical skills

---

## **8\. Demo Constraints**

Since this is an MVP:

* PhantomBuster free tier → only 10 profiles/day.  
* Use preloaded demo profiles for most users.  
* Real-time scraping only for limited beta testers.  
* OpenAI free trial credits cover initial demo.

---

## **9\. Roadmap**

### **🔹 MVP (Current Phase)**

*  Demo web page (input \+ report UI)  
*  PhantomBuster \+ OpenAI integration  
*  Generate AI-powered reports

### **🔹 Future Improvements**

* Web dashboard with history of reports  
* Export to PDF / Markdown  
* Chrome extension for one-click LinkedIn analysis  
* Advanced scoring (tone, influence, engagement)  
* Multi-language support

---

## **10\. Risks & Limitations**

* LinkedIn API restrictions – Official API is limited, PhantomBuster scraping may hit limits.  
* Scalability – Free tiers won’t support many users; need paid plans for scale.  
* User Privacy – Profiles must be analyzed securely (avoid storing data unnecessarily).  
* Cost Management – OpenAI API costs can grow if analysis is heavy.

---

## **11\. Success Metrics**

* 🎯 MVP launch with at least 50–100 demo users.  
* 🎯 Collect user feedback on report quality.  
* 🎯 Validate if users would pay for premium features (PDF reports, unlimited profiles).


---

## **12\. Conclusion**

InSighted 👔 has strong potential as a career optimization AI assistant.  
The MVP focuses on proving the concept with clean reports, AI-driven scoring, and actionable insights.

If validated with early users, the project can grow into a SaaS product with premium features, professional networking tools, and integrations with job search platforms.

<img width="1024" height="1536" alt="ChatGPT Image Aug 21, 2025, 01_11_18 AM" src="https://github.com/user-attachments/assets/f345093a-d5dc-4ccd-aeff-ac87a13bdd51" />
