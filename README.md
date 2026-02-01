# SkyCast
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/yousefammmar/SkyCast)

SkyCast is a beautifully designed, modern weather dashboard that provides real-time weather information and a 5-day forecast for any city worldwide. It features a sleek glassmorphism UI, a responsive layout, and intuitive controls, all built with vanilla HTML, CSS, and JavaScript.

### [View Live Demo](https://yousefammmar.github.io/skycast/)

## Features

-   **Global City Search:** Find current weather data for any location.
-   **Current Weather Dashboard:** View temperature, weather condition, high/low temperatures, and a dynamic weather icon.
-   **Detailed Metrics:** Access granular data including visibility, wind speed, humidity, pressure, "feels like" temperature, and cloudiness.
-   **Sun Cycle:** See today's sunrise and sunset times displayed in stylish cards.
-   **5-Day Forecast:** Plan ahead with a detailed forecast showing daily conditions and high/low temperatures.
-   **Unit Conversion:** Seamlessly toggle the display between Celsius (°C) and Fahrenheit (°F).
-   **Responsive Design:** Enjoy a consistent and visually appealing experience on desktops, tablets, and mobile devices.
-   **About the Team:** An integrated modal introduces the student developers behind the project.

## Technologies Used

-   **Frontend:** HTML5, CSS3, Vanilla JavaScript
-   **APIs:** [Open-Meteo API](https://open-meteo.com/) for free, no-key-required geocoding and weather data.

## Getting Started

To run this project on your local machine, follow these simple steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yousefammmar/skycast.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd skycast
    ```

3.  **Open the application:**
    Open the `index.html` file in your web browser. No web server or build steps are necessary.

## Codebase Overview

The project is structured into three main files:

-   **`index.html`**: Defines the complete HTML structure of the application, including all panels, cards, metrics, the forecast section, and the 'About Us' modal.

-   **`index.css`**: Contains all styling rules. It uses CSS custom properties (`--var`) for an easy-to-manage theme and a signature "glassmorphism" aesthetic. The layout is built with modern CSS techniques like Flexbox and Grid and includes media queries for full responsiveness.

-   **`index.js`**: Powers the application's dynamic functionality. This script handles:
    -   Making asynchronous `fetch` requests to the Open-Meteo Geocoding and Forecast APIs.
    -   Parsing the API responses and dynamically updating the DOM to display weather data.
    -   Managing all user interactions, such as city searches and temperature unit toggling.
    -   Controlling the visibility of the 'About Us' modal.

## About the Team

This project was developed by a team of passionate computer science students from PSUT:

-   **Yousef Odeh**: Software Engineering Student
-   **Tasneem Ahmad**: Computer Science Student
-   **Fatema Alahmad**: Computer Science Student

You can learn more about them by clicking the "About Us" button on the live demo.
