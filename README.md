IT22251664 - Bandara H.M.N.T - Y3S1-WE-02 URL of the hosted application : https://countryexplorer-nine.vercel.app/

The application setup, build process, and usage instructions:

Clone the repository
Client-Side Setup (Frontend): Navigate to the frontend directory and install dependencies. npm install
Backend Setup: Navigate to the backend directory (ensure the folder name is correct, e.g., know-your-world-backend) and install dependencies. npm install
Added Environment variables
Provide a brief report discussing the chosen APIs, any challenges faced, and how they were resolved.

Usage

Viewing Countries The app will display a list of countries fetched from the REST Countries API. We can: Search for countries by name using the search bar. Filter countries by region and language using the dropdown menu. Click on a country to view additional details like population, region, capital, languages, and flag. Add favourite countries by clicking on a button and see in favourites page user profile (After login only)

Interactivity Search: The app allows you to search for countries by their name. The search will update the country list dynamically. Filter by Region: The dropdown allows you to filter countries based on their regions (e.g., Europe, Asia, etc.). Filter by Language: The dropdown allows you to filter countries based on their languages Country Details: Clicking on any country name will show additional details about the country, including its population, capital, languages, flag and also can see the location on world map. Can see boundary countries

API Integration

This application integrates with the REST Countries API to fetch country data. The API provides various endpoints:

GET /all – Get a list of all countries. [https://restcountries.com/v3.1/all]

GET /name/{name} – Search for a country by its name. [https://restcountries.com/v3.1/name/{name}]

GET /region/{region} – Get countries from a specific region. [https://restcountries.com/v3.1/region/{region}]

GET /alpha/{code} – Get full details using a country code. [https://restcountries.com/v3.1/alpha/{code}]

GET /language/{language} – Get countries from a specific languages. [https://restcountries.com/v3.1/lang/{language}]

Data Displayed: Country Name, Population, Region, Languages, Flag, Capital, Location in map, Boundary Countries

Testing

Running Unit and Integration Tests npm test

Test Coverage

Tests are written using Jest and React Testing Library to ensure that: The search functionality works correctly. The filters update the country list dynamically. The country details are displayed correctly when a country is clicked. Login and SignUp functionality

Challenges and Resolutions

Handling Large API Responses Challenge: The API returns a large list of countries, which could slow down the page loading time.
Resolution: Implemented pagination and only displayed a limited number of countries at once to improve the user experience.

Managing User Session Challenge: Implementing session management for a logged-in user to store their favorite countries.
Resolution: Used React's Context API and localStorage to manage user sessions and persist login states across page reloads.

Cross-Browser Compatibility Challenge: Ensuring the app works seamlessly across different browsers.
Resolution: Used Tailwind CSS for responsive design, which helps maintain consistency across browsers. Also tested on Chrome, Firefox, and Safari.

Testing Dynamic Content Challenge: Testing dynamic content such as search and filter functionalities.
Resolution: Wrote unit and integration tests with Jest and React Testing Library to test the functionality of the search bar, filter dropdown, and dynamic updates.