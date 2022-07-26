import { Film } from '../Models/Film.model';
import { QueryEnum } from '../Models/QuerryType.enum';
import { HttpClientService } from './HttpClient.service';
import { HtmlGeneratorService } from './HtmlGenerator.service';

export class MainService {

    private readonly SEARCH_API = 'https://api.themoviedb.org/3/search/movie';
    private readonly TOP_RATED_API = 'https://api.themoviedb.org/3/movie/top_rated';
    private readonly POPULAR_API = 'https://api.themoviedb.org/3/movie/popular';
    private readonly UPCOMING_API = 'https://api.themoviedb.org/3/movie/upcoming';

    private readonly HttpClientService = new HttpClientService();
    private readonly HtmlGeneratorService = new HtmlGeneratorService();

    private page = 1;

    private lastAction: QueryEnum = QueryEnum.Popular;

    public async Search(query: string, inPage = 1, clear = true) {

        const q = `&query=${query}`;

        this.HttpClientService.DoFetch(this.SEARCH_API, this.ChoosePage(inPage), q)
            .then(movies => {
                this.GenerateHtml(movies, clear);
                this.RandomMovie(movies);
                this.lastAction = QueryEnum.Search;
                this.FavouriteGenerator();
                this.RenderFavorite();
            });
    }

    public async TopRated(inPage = 1, clear = true) {
        this.HttpClientService.DoFetch(this.TOP_RATED_API, this.ChoosePage(inPage))
            .then(movies => {
                this.GenerateHtml(movies, clear);
                this.RandomMovie(movies);
                this.lastAction = QueryEnum.TopRated;
                this.FavouriteGenerator();
                this.RenderFavorite();
            });
    }

    public async Upcoming(inPage = 1, clear = true) {
        this.HttpClientService.DoFetch(this.UPCOMING_API, this.ChoosePage(inPage))
            .then(movies => {
                this.GenerateHtml(movies, clear);
                this.RandomMovie(movies);
                this.lastAction = QueryEnum.Upcoming;
                this.FavouriteGenerator();
                this.RenderFavorite();
            });
    }

    public async Popular(inPage = 1, clear = true) {
        this.HttpClientService.DoFetch(this.POPULAR_API, this.ChoosePage(inPage))
            .then(movies => {
                this.GenerateHtml(movies, clear);
                this.RandomMovie(movies);
                this.lastAction = QueryEnum.Popular;
                this.FavouriteGenerator();
                this.RenderFavorite();
            });
    }

    public async LoadMore() {
        const searchInput = document.getElementById('search') as HTMLInputElement;
        switch (this.lastAction) {
            case QueryEnum.Search:
                await this.Search(searchInput.value, ++this.page, false);
                break;
            case QueryEnum.Popular:
                await this.Popular(++this.page, false);
                break;
            case QueryEnum.TopRated:
                await this.TopRated(this.page, false);
                break;
            case QueryEnum.Upcoming:
                await this.Upcoming(this.page, false);
                break;
        }

    }

    public FavouriteGenerator() {
        const nodes = document.querySelectorAll('svg[stroke="red"]')!;

        for (const node of nodes) {
            node.addEventListener('click', () => {
                const key = node.attributes.getNamedItem('id')!.value;

                if (localStorage.getItem(key)) {
                    localStorage.removeItem(key);
                    node.attributes.getNamedItem('fill')!.value = '#ff000078';
                    this.RenderFavorite();
                } else {
                    localStorage.setItem(key, key);
                    node.attributes.getNamedItem('fill')!.value = 'red';
                    this.RenderFavorite();
                }

            });
        }
    }

    public RenderFavorite() {
        const favorite_div = document.getElementById('favorite-movies') as HTMLDivElement;
        favorite_div.innerHTML = '';

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.getItem(localStorage.key(i)!);

            fetch(`https://api.themoviedb.org/3/movie/${key}?api_key=de99f9bb1275997f321464fec53514bc`)
                .then(response => response.json())
                .then(file => new Film(file.backdrop_path, file.overview, file.title, file.release_date, file.id))
                .then(f => favorite_div.insertAdjacentHTML('beforeend', this.HtmlGeneratorService.GenerateMovieToFavorite(f)))
                .then(() => {
                    const svgs = favorite_div.querySelectorAll('svg[stroke="red"]');
                    for (const svg of svgs) {
                        svg.addEventListener('click', () => {
                            const key = svg.attributes.getNamedItem('id')!.value;

                            if (localStorage.getItem(key)) {
                                localStorage.removeItem(key);
                                svg.attributes.getNamedItem('fill')!.value = '#ff000078';

                            } else {
                                localStorage.setItem(key, key);
                                svg.attributes.getNamedItem('fill')!.value = 'red';
                            }
                        });

                    }
                });
        }

    }

    private ChoosePage(i: number): number {
        let pageNumber = this.page;

        if (i != 1) {
            pageNumber = i;
        } else {
            this.page = 1;
        }

        return pageNumber;
    }

    private RandomMovie(movies: Film[]) {
        const i = Math.floor(Math.random() * (movies.length));

        const div = document.getElementById('random-movie')!;
        div.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${movies[i].backdrop_path})`;
        div.innerHTML = this.HtmlGeneratorService.GenerateRandomMovie(movies[i]);
    }

    private GenerateHtml(movies: Film[], clear = true): void {
        const film_container = document.getElementById('film-container') as HTMLDivElement;

        if (clear) film_container.innerHTML = '';

        for (const movie of movies) {

            //******** OPTIONAL ********//
            if (movie.backdrop_path == null) break;

            film_container.insertAdjacentHTML('beforeend', this.HtmlGeneratorService.GenerateMovieToGrid(movie));
        }
    }

}
