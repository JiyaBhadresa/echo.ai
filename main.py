from flask import Flask, render_template, request, jsonify
import os
import json
import requests
from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OMDB_API_KEY = os.getenv("OMDB_API_KEY")

client = genai.Client(api_key=GEMINI_API_KEY)

app = Flask(__name__)

OMDB_URL = "http://www.omdbapi.com/"


# OMDB FUNCTION
def get_movie_details(title):
    try:
        params = {
            "apikey": OMDB_API_KEY,
            "t": title,
            "plot": "short"
        }

        res = requests.get(OMDB_URL, params=params)
        data = res.json()

        if data.get("Response") == "True":
            return {
                "title": data.get("Title"),
                "year": data.get("Year"),
                "rating": data.get("imdbRating"),
                "genre": data.get("Genre"),
                "plot": data.get("Plot"),
                "actors": data.get("Actors"),
                "director": data.get("Director"),
                "poster": data.get("Poster")
            }

        return None

    except Exception as e:
        print("OMDb Error:", e)
        return None


# GEMINI FUNCTION
def get_recommendations(prompt):

    try:
        response = client.models.generate_content(
            model="gemma-4-31b-it",
            contents=f"""
You are a movie recommendation AI.

Give exactly 4 movies in JSON format like this:

[
  {{"title": "Movie Name"}},
  {{"title": "Movie Name"}}
]

User preferences:
{prompt}
"""
        )

        text = response.text.strip()

        start = text.find("[")
        end = text.rfind("]") + 1

        json_text = text[start:end]

        return json.loads(json_text)

    except Exception as e:
        print("Gemini Error:", e)
        return []


@app.route("/")
def home():
    return render_template("index.html")
@app.route("/results")
def results():
    return render_template("results.html")


@app.route("/recommend", methods=["POST"])
def recommend():

    data = request.json

    mood = data["mood"]
    people = data["people"]
    genre = data["genre"]
    era = data["era"]
    industry = data["industry"]

    prompt = f"""
Mood: {mood}
People: {people}
Genre: {genre}
Era: {era}
Industry: {industry}
"""

    recs = get_recommendations(prompt)

    final_movies = []

    for movie in recs:

        title = movie.get("title")

        details = get_movie_details(title)

        if details:
            final_movies.append(details)

    with open("movies.json", "w") as f:
        json.dump(final_movies, f, indent=2)

    return jsonify(final_movies)


if __name__ == "__main__":
    app.run(debug=True)