import { Film } from '../Models/Film.model';

export class HtmlGeneratorService {
    public GenerateRandomMovie(movie: Film): string{
        return `
                <div class='row py-lg-5'>
                    <div class='col-lg-6 col-md-8 mx-auto' style='background-color: #2525254f'>
                        <h1 id='random-movie-name' class='fw-light text-light'>${movie.title}</h1>
                        <p id='random-movie-description' class='lead text-white'>${movie.overview}</p>
                    </div>
                </div>
                `
    }

    public GenerateMovieToGrid(movie: Film): string{
        return `
                <div class='col-lg-3 col-md-4 col-12 p-2'>
                    <div class='card shadow-sm'>
                        <img src='https://image.tmdb.org/t/p/original/${movie.backdrop_path}'/>
                        <svg
                        xmlns='http://www.w3.org/2000/svg'
                        stroke='red'
                        fill='${localStorage.getItem(movie.id.toString()) ? 'red' : '#ff000078'}'
                        width='50'
                        height='50'
                        id='${movie.id}'
                        class='bi bi-heart-fill position-absolute p-2'
                        viewBox='0 -2 18 22'
                        >
                        <path fill-rule='evenodd' d='M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z'/>
                        </svg>
                        <div class='card-body'>
                            <p class='card-text truncate'>${movie.overview}</p>
                            <div class='d-flex justify-content-between align-items-center'>
                                <small class='text-muted'>${movie.release_date}</small>
                            </div>
                        </div>
                    </div>
                </div>
                `
    }

    public GenerateMovieToFavorite(movie: Film): string{
        return `
                <div class='col-12 p-2'>
                    <div class='card shadow-sm'>
                        <img src='https://image.tmdb.org/t/p/original/${movie.backdrop_path}'/>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            stroke='red'
                            fill='red'
                            width='50'
                            height='50'
                            id='${movie.id}'
                            class='bi bi-heart-fill position-absolute p-2'
                            viewBox='0 -2 18 22'
                            >
                            <path fill-rule='evenodd' d='M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z'/>
                        </svg>
                        <div class='card-body'>
                            <p class='card-text truncate'>${movie.overview}</p>
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
                </div>
                `
    }
}
