# IP Address Lookup Tool

---

## Overview

This is a simple, yet powerful web application designed to help users quickly look up detailed information about any IPv4 or IPv6 address. Built with a clean, user-friendly interface, it leverages the `ipinfo.io` API to fetch geographical, organizational, and other key details related to an IP address.

---

## Features

* **IP Address Validation:** Ensures valid IPv4 or IPv6 format before lookup.

* **Detailed IP Information:** Displays city, region, country, organization, location coordinates, postal code, and timezone.

* **Copy to Clipboard:** Convenient buttons to easily copy individual pieces of information.

* **Loading Indicators:** Provides visual feedback during API calls.

* **Responsive Design:** Optimized for seamless use across various devices (desktop, tablet, mobile).

* **Animated UI:** Subtle animations for a more engaging user experience.

* **Stylish Background:** Features an aesthetically pleasing background image with a dark overlay for improved readability.

---

## Technologies Used

* **HTML5:** For the core structure of the web page.

* **CSS3 (with Tailwind CSS):** For styling, responsive design, and animations.

* **JavaScript (ES6+):** For fetching data, handling user interactions, and dynamic content updates.

* **ipinfo.io API:** The primary data source for IP address information.

---

## Setup and Usage

1.  **Save the file:** Save the provided HTML code as `index.html` (or any `.html` file).

2.  **Open in Browser:** Open the `index.html` file in your web browser.

3.  **API Key (Optional but Recommended):**

    * While `ipinfo.io` offers basic lookups without an API key, it's highly recommended to obtain a free API key from [ipinfo.io](https://ipinfo.io) for more reliable and consistent usage, especially if you anticipate frequent lookups.

    * Locate the `API_KEY` variable in the `<script>` section of your `index.html` file (around line 200).

    * Replace `'YOUR_API_KEY_HERE'` with your actual API key:

        ```javascript
        const API_KEY = 'YOUR_API_KEY_HERE'; // <--- Place your API key here
        ```

        (Note: In the current version, this is already set to `54bd0c787cb233` for demonstration, but you should replace it with your own key for production use if you wish).

4.  **Enter IP Address:** In the input field, type an IPv4 (e.g., `8.8.8.8`) or IPv6 (e.g., `2001:4860:4860::8888`) address.

5.  **Lookup:** Click the "Lookup IP" button or press `Enter`.

6.  **View Results:** The IP information will be displayed below the input field.

---

## Screenshots

Below is a conceptual image representing the project. You might want to replace this with an actual screenshot of the running application for your `README.md`.

---

## Contributing

Feel free to fork this repository, suggest improvements, or contribute to the project.
