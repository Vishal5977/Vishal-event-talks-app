# Vishal Event Talks App (BigQuery Release Notes)

A modern, responsive web application that fetches, parses, and displays the official Google Cloud BigQuery release notes from its RSS/Atom feed. Built with Python, Flask, and vanilla HTML/CSS/JS.

## Features

- **Live Feed Parsing**: Dynamically fetches and parses the latest updates from the official BigQuery XML feed.
- **Modern Aesthetic**: Dark-mode UI with sleek gradients, hover animations, and a responsive flexbox layout.
- **Asynchronous Refresh**: Seamlessly refresh the feed with a click of a button, featuring a custom CSS loading spinner.
- **Interactive Tweet Composer**: Click on any release note to open a stylish modal to compose a tweet. It includes a real-time character counter and a rich preview card simulating what the tweet will look like on Twitter.

## Project Structure

- `app.py`: The main Flask backend server.
- `requirements.txt`: Python package dependencies.
- `templates/index.html`: The HTML structure of the app.
- `static/styles.css`: The styling and CSS animations.
- `static/script.js`: Frontend logic for fetching data and handling the interactive Tweet modal.

## Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Vishal5977/Vishal-event-talks-app.git
   cd Vishal-event-talks-app
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server**:
   ```bash
   python app.py
   ```

4. **View the app**:
   Open your browser and navigate to `http://127.0.0.1:5000/`.
