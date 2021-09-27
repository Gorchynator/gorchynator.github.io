const fetchData = async (searchTerm) => {
    const response = await axios.get(`http://www.omdbapi.com/`, {
        params: {
            apikey: `e08a14a1`,
            s: searchTerm
        }
    });
    if(response.data.Error) {
        return[];
    }
    return response.data.Search;
}

autocomplete({
    root: document.querySelector(`.left-autocomplete`),
    position: `left`
});
autocomplete({
    root: document.querySelector(`.right-autocomplete`),
    position: `right`
});

let leftMovie;
let rightMovie;
const movieSelect = async (movie, position) => {
    document.querySelector(`.tutorial`).classList.add(`is-hidden`);
    const response = await axios.get(`http://www.omdbapi.com/`, {
        params: {
            apikey: `e08a14a1`,
            i: movie.imdbID
        }
    });
    document.querySelector(`#${position}-summary`).innerHTML = movieTemplate(response.data);

    if(position === `left`){
        leftMovie = response.data;
    }
    else{
        rightMovie = response.data;
    }
    if(leftMovie && rightMovie) {
        compare();
    }
}

const compare = () => {
    const leftStats = document.querySelectorAll(`#left-summary .notification`);
    const rightStats = document.querySelectorAll(`#right-summary .notification`);

    leftStats.forEach((leftStat, i) => {
        const leftVal = parseInt(leftStat.dataset.value);
        const rightVal = parseInt(rightStats[i].dataset.value);
        if(rightVal > leftVal) {
            leftStat.classList.remove(`is-primary`);
            leftStat.classList.add(`is-warning`);
        }
        else{
            rightStats[i].classList.remove(`is-primary`);
            rightStats[i].classList.add(`is-warning`);
        }
    });
}

const movieTemplate = (movieDetails) => {
    const awards = movieDetails.Awards.split(` `).reduce((prev, word) => {
        if(isNaN(parseInt(word))) {
            return prev;
        }
        else{
            return prev + parseInt(word);
        }
    }, 0);
    const boxOffice = parseInt(movieDetails.BoxOffice.replace(/\$/g, ``).replace(/,/g, ``));
    const metaScore = parseInt(movieDetails.Metascore);
    const imdb = parseFloat(movieDetails.imdbRating);
    const votes = parseInt(movieDetails.imdbVotes.replace(/,/g, ``));

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                <img src="${movieDetails.Poster}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetails.Title}</h1>
                    <h4>${movieDetails.Genre}</h4>
                    <p>${movieDetails.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetails.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${boxOffice} class="notification is-primary">
            <p class="title">${movieDetails.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metaScore} class="notification is-primary">
            <p class="title">${movieDetails.Metascore}</p>
            <p class="subtitle">Metascore Rating</p>
        </article>
        <article data-value=${imdb} class="notification is-primary">
            <p class="title">${movieDetails.imdbRating}</p>
            <p class="subtitle">IMDb Rating</p>
        </article>
        <article data-value=${votes} class="notification is-primary">
            <p class="title">${movieDetails.imdbVotes}</p>
            <p class="subtitle">IMDb Votes</p>
        </article>
    `;
}