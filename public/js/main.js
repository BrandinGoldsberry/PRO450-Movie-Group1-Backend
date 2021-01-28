import {stars} from './stars.js';
import {movieService} from './movieService.js';

window.onload = (e) => {
    //Essentially makes all stars blank
    stars.initializeStars();
    movieService.getMovieReviews();
}