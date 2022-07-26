import { Film } from './Film';

enum QueryEnum {
    Search, Popular, Upcoming, TopRated
}

export class Service {

    private readonly SEARCH_API = 'https://api.themoviedb.org/3/search/movie';

    private readonly TOP_RATED_API = 'https://api.themoviedb.org/3/movie/top_rated';
    private readonly POPULAR_API = 'https://api.themoviedb.org/3/movie/popular';
    private readonly UPCOMING_API = 'https://api.themoviedb.org/3/movie/upcoming';

    private readonly API_KEY = '?api_key=de99f9bb1275997f321464fec53514bc';

    private page = 1;

    private lastAction: QueryEnum | undefined = QueryEnum.Popular;

    public async Search(query: string, inPage = 1, clear = true) {
        let page_address = '&page=' + this.page;

        if (inPage)
            page_address = '&page=' + inPage
        else
            this.page = 1;

        const q = `&query=${query}`;


        fetch(`${this.SEARCH_API}${this.API_KEY}${q}${page_address}`)
            .then(response => response.json())
            .then(file => this.Map(file.results))
            .then(movies => {
                this.GenerateHtml(movies, clear);
                this.RandomMovie(movies);
                this.lastAction = QueryEnum.Search;
                this.FavouriteGenerator();
            });

    }

    public async TopRated(inPage = 1, clear = true) {
        let page_address = '&page=' + this.page;

        if (inPage)
            page_address = '&page=' + inPage
        else
            this.page = 1;

        fetch(`${this.TOP_RATED_API}${this.API_KEY}${page_address}`)
            .then(response => response.json())
            .then(file => this.Map(file.results))
            .then(movies => {
                this.GenerateHtml(movies, clear);
                this.RandomMovie(movies);
                this.lastAction = QueryEnum.TopRated;
                this.FavouriteGenerator();
            });
    }

    public async Upcoming(inPage = 1, clear = true) {
        let page_address = '&page=' + this.page;

        if (inPage)
            page_address = '&page=' + inPage
        else
            this.page = 1;


        fetch(`${this.UPCOMING_API}${this.API_KEY}${page_address}`)
            .then(response => response.json())
            .then(file => this.Map(file.results))
            .then(movies => {
                this.GenerateHtml(movies, clear);
                this.RandomMovie(movies);
                this.lastAction = QueryEnum.Upcoming;
                this.FavouriteGenerator();
            });
    }

    public async Popular(inPage = 1, clear = true) {
        let page_address = '&page=' + this.page;

        if (inPage)
            page_address = '&page=' + inPage
        else
            this.page = 1;


        fetch(`${this.POPULAR_API}${this.API_KEY}${page_address}`)
            .then(response => response.json())
            .then(file => this.Map(file.results))
            .then(movies => {
                this.GenerateHtml(movies, clear);
                this.RandomMovie(movies);
                this.lastAction = QueryEnum.Popular;
                this.FavouriteGenerator();
            });
    }

    public LoadMore() {
        const searchInput = document.getElementById('search') as HTMLInputElement;
        switch (this.lastAction) {
            case QueryEnum.Search:
                this.Search(searchInput.value, ++this.page, false);
                break;
            case QueryEnum.Popular:
                this.Popular(++this.page, false);
                break;
            case QueryEnum.TopRated:
                this.TopRated(this.page, false);
                break;
            case QueryEnum.Upcoming:
                this.Upcoming(this.page, false);
                break;
        }

    }

    private RandomMovie(movies: Film[]) {
        const i = Math.floor(Math.random() * (movies.length));

        const div = document.getElementById('random-movie')!;
        div.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${movies[i].backdrop_path})`;
        div.style.backgroundPosition = `center`;
        div.style.backgroundSize = `cover`;
        div.style.backgroundRepeat = `no-repeat`;
        div.innerHTML = `<div class='row py-lg-5'>
                    <div
                        class='col-lg-6 col-md-8 mx-auto'
                        style='background-color: #2525254f'
                    >
                        <h1 id='random-movie-name' class='fw-light text-light'>${movies[i].title}</h1>
                        <p id='random-movie-description' class='lead text-white'>
                            ${movies[i].overview}
                        </p>
                    </div>
                </div>`;



    }

    private Map(obj: any[]): Film[] {
        const result = new Array<Film>();

        for (const film of obj) {
            result.push(new Film(film.backdrop_path, film.overview, film.title, film.release_date, film.id));
        }

        return result;
    }

    private GenerateHtml(movies: Film[], clear = true): void {
        const film_container = document.getElementById('film-container') as HTMLDivElement;

        if (clear) film_container.innerHTML = '';

        for (const movie of movies) {
            if (movie.backdrop_path == null) break;

            film_container.insertAdjacentHTML('beforeend', `<div class='col-lg-3 col-md-4 col-12 p-2'>
                            <div class='card shadow-sm'>
                                <img src='https://image.tmdb.org/t/p/original/${movie.backdrop_path}'/>
        <svg
            xmlns='http://www.w3.org/2000/svg'
        stroke='red'
        fill='${localStorage.getItem(movie.id.toString()) ? "red" : "#ff000078"}'
        width='50'
        height='50'
        id=${movie.id}
        class='bi bi-heart-fill position-absolute p-2'
        viewBox='0 -2 18 22'
        >
        <path
            fill-rule='evenodd'
        d='M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z'
            />
            </svg>
            <div class='card-body'>
        <p class='card-text truncate'>
            ${movie.overview}
            </p>
            <div
        class='
        d-flex
        justify-content-between
        align-items-center
        '
        >
        <small class='text-muted'>${movie.release_date}</small>
            </div>
            </div>
            </div>
            </div>`);
        }

    }

    public FavouriteGenerator(){
        const nodes = document.querySelectorAll('svg[stroke="red"]')!

        for (const node of nodes) {
            node.addEventListener('click', () => {
                const key = node.attributes.getNamedItem('id')!.value;

                if(localStorage.getItem(key)) {
                    localStorage.removeItem(key)
                    node.attributes.getNamedItem('fill')!.value = '#ff000078';
                    this.RenderFavorite()
                }
                else{
                    localStorage.setItem(key, key)
                    node.attributes.getNamedItem('fill')!.value = 'red';
                    this.RenderFavorite()
                }

            })
        }
    }

    public RenderFavorite(){
        const favorite_div = document.getElementById('favorite-movies') as HTMLDivElement;
        favorite_div.innerHTML = '';

        for (let i = 0; i < localStorage.length; i++){
            const key = localStorage.getItem(localStorage.key(i)!)

            fetch(`https://api.themoviedb.org/3/movie/${key}?api_key=de99f9bb1275997f321464fec53514bc`)
                .then(response => response.json())
                .then(file => new Film(file.backdrop_path, file.overview, file.title, file.release_date, file.id))
                .then(f => {
                    favorite_div.insertAdjacentHTML('beforeend', `
        <div class="col-12 p-2">
                    <div class="card shadow-sm">
                        <img
                            src="https://image.tmdb.org/t/p/original/${f.backdrop_path}"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            stroke="red"
                            fill="red"
                            width="50"
                            height="50"
                            id='${f.id}'
                            class="bi bi-heart-fill position-absolute p-2"
                            viewBox="0 -2 18 22"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
                            />
                        </svg>
                        <div class="card-body">
                            <p class="card-text truncate">
                                ${f.overview}
                            </p>
                            <div
                                class="
                                    d-flex
                                    justify-content-between
                                    align-items-center
                                "
                            >
                                <small class="text-muted">${f.release_date}</small>
                            </div>
                        </div>
                    </div>
                </div>
        `)
                })
                .then(() => {
                    const svgs = favorite_div.querySelectorAll('svg[stroke="red"]')
                    for (const svg of svgs) {
                        svg.addEventListener('click', () => {
                            const key = svg.attributes.getNamedItem('id')!.value;

                            if(localStorage.getItem(key)) {
                                localStorage.removeItem(key)
                                svg.attributes.getNamedItem('fill')!.value = '#ff000078';
                                
                            }
                            else{
                                localStorage.setItem(key, key)
                                svg.attributes.getNamedItem('fill')!.value = 'red';
                            }
                        })

                    }
                })
        }


        
    }

}
