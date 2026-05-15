async function loadMovies() {

    const mood = localStorage.getItem("mood");
    const people = localStorage.getItem("people");
    const genre = localStorage.getItem("genre");
    const era = localStorage.getItem("era");
    const industry = localStorage.getItem("industry");

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

    const resultsDiv = document.getElementById("results");

    resultsDiv.innerHTML = "";

    movies.forEach(movie => {

        resultsDiv.innerHTML += `

        <div class="movie-card">

            <img src="${movie.poster}">

            <div class="movie-info">

                <h2>${movie.title} (${movie.year})</h2>

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

loadMovies();