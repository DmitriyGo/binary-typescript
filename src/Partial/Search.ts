import { Film } from '../Film';

export class Search {

    private readonly SEARCH_API = 'https://api.themoviedb.org/3/search/movie';

    private readonly TOP_RATED_API = 'https://api.themoviedb.org/3/movie/top_rated';
    private readonly POPULAR_API = 'https://api.themoviedb.org/3/movie/popular';
    private readonly UPCOMING_API = 'https://api.themoviedb.org/3/movie/upcoming'

    private readonly API_KEY = '?api_key=de99f9bb1275997f321464fec53514bc';

    private page = 1;

    public async Search(query: string) {
        this.page = 1;

        const q = `&query=${query}`;
        const page_address = '&page=' + this.page;

        fetch(`${this.SEARCH_API}${this.API_KEY}${q}${page_address}`)
            .then(response => response.json())
            .then(file => Search.Map(file.results))
            .then(movies => Search.GenerateHtml(movies));

    }

    public async TopRated() {
        this.page = 1;

        const page_address = '&page=' + this.page;

        fetch(`${this.TOP_RATED_API}${this.API_KEY}${page_address}`)
            .then(response => response.json())
            .then(file => Search.Map(file.results))
            .then(movies => Search.GenerateHtml(movies));
    }

    public async Upcoming() {
        this.page = 1;

        const page_address = '&page=' + this.page;

        fetch(`${this.UPCOMING_API}${this.API_KEY}${page_address}`)
            .then(response => response.json())
            .then(file => Search.Map(file.results))
            .then(movies => Search.GenerateHtml(movies));
    }

    public async Popular() {

        this.page = 1;

        const page_address = `&page=${this.page}`;

        fetch(`${this.POPULAR_API}${this.API_KEY}${page_address}`)
            .then(response => response.json())
            .then(file => Search.Map(file.results))
            .then(movies => Search.GenerateHtml(movies));
    }

    private static Map(obj: any[]): Film[] {
        const result = new Array<Film>();

        for (const film of obj) {
            result.push(new Film(film.backdrop_path, film.overview, film.title, film.release_date));
        }

        return result;
    }

    private static GenerateHtml(movies: Film[]): void {
        const film_container = document.getElementById('film-container') as HTMLDivElement;

        film_container.innerHTML = '';

        for (const movie of movies) {
            if(movie.backdrop_path == null)
                break;

            film_container.insertAdjacentHTML('beforeend',
                `<div class='col-lg-3 col-md-4 col-12 p-2'>
                            <div class='card shadow-sm'>
                                <img src='https://image.tmdb.org/t/p/original/${movie.backdrop_path}'/>
        <svg
            xmlns='http://www.w3.org/2000/svg'
        stroke='red'
        fill='#ff000078'
        width='50'
        height='50'
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

}
