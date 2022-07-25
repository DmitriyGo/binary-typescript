export class Film{
    constructor(backdrop_path: string, overview: string, title: string, release_date: string) {
        this.backdrop_path = backdrop_path;
        this.overview = overview;
        this.title = title;
        this.release_date = release_date;
    }

    backdrop_path = '';
    overview = '';
    title = '';
    release_date = '';
}
