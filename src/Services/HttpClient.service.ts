import { Film } from '../Models/Film.model';

export class HttpClientService{
    private readonly apiKey = '?api_key=de99f9bb1275997f321464fec53514bc';

    private Map(obj: any[]): Film[] {
        const result = new Array<Film>();

        for (const film of obj) {
            result.push(new Film(film.backdrop_path, film.overview, film.title, film.release_date, film.id));
        }

        return result;
    }

    public DoFetch(domain: string, pageNumber: number, queryString = '' ): Promise<Film[]>{
        return fetch(`${domain}${this.apiKey}&page=${pageNumber}${queryString}`)
            .then(response => response.json())
            .then(file => this.Map(file.results))
    }
}
