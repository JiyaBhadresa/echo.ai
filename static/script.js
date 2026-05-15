function scrollToForm() {

    document.getElementById("formSection")
        .scrollIntoView({ behavior: "smooth" });
}

async function getRecommendations() {

    const mood = document.getElementById("mood").value;
    const people = document.getElementById("people").value;
    const genre = document.getElementById("genre").value;
    const era = document.getElementById("era").value;
    const industry = document.getElementById("industry").value;

    const results = document.getElementById("results");

    results.innerHTML = "<h2>Loading recommendations...</h2>";

    const response = await fetch("/recommend", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            mood,
            people,
            genre,
            era,
            industry
        })
    });

    const movies = await response.json();

    results.innerHTML = "";

    movies.forEach(movie => {

        results.innerHTML += `

        <div class="movie-card">

            <img src="${movie.poster}" />

            <div class="movie-info">

                <h3>${movie.title} (${movie.year})</h3>

                <p><b>⭐ Rating:</b> ${movie.rating}</p>

                <p><b>🎭 Genre:</b> ${movie.genre}</p>

                <p><b>🎬 Director:</b> ${movie.director}</p>

                <p><b>👨‍🎤 Actors:</b> ${movie.actors}</p>

                <p><b>📖 Plot:</b> ${movie.plot}</p>

            </div>

        </div>
        `;
    });
}