const autocomplete = ({root, position}) => {
    root.innerHTML = `
        <label><b>Search For a Movie</b></label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"> 
                </div>
            </div>
        </div>
    `;
    const input = root.querySelector(`input`);
    const dropdown = root.querySelector(`.dropdown`);
    const resultsWrapper = root.querySelector(`.results`);

    const debounce = (f) => {
        let timeoutID;
        return (...args) => {
            if(timeoutID) {
                clearTimeout(timeoutID);
            }
            timeoutID = setTimeout(() => {
                f.apply(null, args);
            }, 500);
        }
    }

    const search = debounce(async event => {
        const movies = await fetchData(event.target.value);
        if(!movies.length) {
            dropdown.classList.remove(`is-active`);
            return;
        }
        resultsWrapper.innerHTML = ``;
        dropdown.classList.add(`is-active`);
        for(let movie of movies) {
            const a = document.createElement(`a`);
            const imgSrc = movie.Poster === `N/A` ? `` : movie.Poster;
            a.classList.add(`dropdown-item`);
            a.innerHTML = `
                <img src="${imgSrc}"/>
                ${movie.Title} (${movie.Year})
            `;
            a.addEventListener(`click`, () => {
                input.value = movie.Title;
                dropdown.classList.remove(`is-active`);
                movieSelect(movie, position);
            });
            resultsWrapper.append(a);
        }
    });
    input.addEventListener(`input`, search);

    document.addEventListener(`click`, event => {
        if(!root.contains(event.target)) {
            dropdown.classList.remove(`is-active`);
        }
    });
};