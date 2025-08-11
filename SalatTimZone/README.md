# **SalatTimZone – Simple Prayer Time Finder**


<img width="1912" height="962" alt="screencapture-localhost-4028-2025-08-11-23_58_33" src="https://github.com/user-attachments/assets/fb8acae3-392e-4164-8af5-48a81b8f510e" />

## **📌 Project Overview**

SalatTimeZone is a lightweight and user-friendly web application designed to help Muslims quickly find today’s prayer times for any country.

With just the country name, users can view the five daily salawat — Fajr, Dhuhr, Asr, Maghrib, and Isha — along with:

* The next upcoming prayer  
* A live countdown timer until it begins  
* "Passed" labels for prayers that have already occurred today

The app ensures that prayer schedules are accurate, accessible, and easy to check anytime, anywhere.

## **🎯 Objectives**

* Provide accurate daily prayer times for any location.  
* Make it easy for users to know which prayers remain for the day.  
* Offer a clear, minimal, mobile-friendly interface for quick access.

## **🛠️ Tech Stack**

* Frontend: React.js (Functional Components, Hooks)  
* Styling: SASS (for responsive and modern UI)  
* API Provider: [MuslimSalat.com](https://muslimsalat.com/) API  
* Utilities: JavaScript Date/Time calculations for countdown logic  
* Deployment: Vercel / Netlify

## **⚙️ How It Works**

1. Search Input – User enters a country name (e.g., *Morocco*).  
2. API Request – The app sends a GET request to: [https:*//muslimsalat.com/{country}.json?key=YOUR\_API\_KEY*](https://muslimsalat.com/{country}.json?key=YOUR_API_KEY)  
3. API Response – Returns today’s prayer times.  
4. Processing & Display – The app:  
   1. Displays all prayer times in an elegant list or card format.  
   2. Highlights the next upcoming prayer.  
   3. Shows a countdown until the next prayer.  
   4. Marks past prayers with a "Passed" label.

## 

## 

## **✨ Features**

* 🔍 Search prayer times by country  
* 🕒 Live countdown to the next salat  
* ✅ "Passed" indicator for past prayers  
* 📱 Mobile-friendly, responsive UI

## **📊 Example Output**

For Morocco – August 10, 2025

| Prayer | Time | Status |
| ----- | ----- | ----- |
| Fajr | 05:15 | Passed |
| Dhuhr | 13:25 | Passed |
| Asr | 17:10 | Next in 1h 20m |
| Maghrib | 20:05 | Upcoming |
| Isha | 21:25 | Upcoming |

## **Future Enhancements**

* 📢 Prayer Notifications – Alerts before each salat.  
* 🧭 Qibla Compass – Direction of the Kaaba based on location.  
* 🌙 Hijri Calendar – Display Islamic date alongside Gregorian date.  
* 🌐 Multi-language Support – English, Arabic, French, etc.

## **📈 Future Improvements**

* Offline mode with cached prayer times.

## **📥 Installation & Setup**

1\. Clone the repository git clone https://github.com/your-username/salattime.git  
cd salattime   
2\. Install dependencies  
npm install

3\. Create a .env file

REACT\_APP\_API\_KEY=your\_api\_key\_here  \=   
4\. Start the development server  
npm start
