const getMovieReviews = () => {
    let cards = document.getElementsByClassName("movie-card");
    for (const card of cards) {
        axios.get("/reviews/reviews-by-movie?movieId=" + card.dataset.movieid).then(res => {
            console.log(res);
            if(!res.data.error) {
                const ratings = Object.values(res.data.reviews).map(review => parseFloat(review.rating.$numberDecimal));
                let avgRating = Math.round((ratings.reduce((r1, r2) => r1 + r2) / ratings.length) * 2) / 2;
                
                //5th child of card is the info section
                //The second child of that is the reviews listing
                //The second child of that is the review counter
                let cardRatingCounter = card.children[4].children[0].children[1];
                cardRatingCounter.innerHTML=`${ratings.length} Ratings`;

                //5th child of card is the info section
                //The first child of that is the avg reviews section
                //The first child of that is the stars
                let cardAvgRating = card.children[4].children[0].children[0];
                cardAvgRating.dataset.ratingval = avgRating;
                
                let curRating = avgRating;

                let fullStars = Math.floor(curRating);
                let halfStars = curRating % 1 != 0 ? 1 : 0;
                //emptyStars = Math.floor(5 - curRating);
        
                for (let i = 1; i <= 5; i++) {
                    let currentStar = cardAvgRating.children[i - 1];
                    currentStar.innerHTML = "";
                    let newIcon = document.createElement("i");
        
                    if(i <= fullStars) {
                        newIcon.className = currentStar.dataset["full"];
                        currentStar.append(newIcon)
                    } else if(i === fullStars + halfStars) {
                        newIcon.className = currentStar.dataset["half"];
                        currentStar.append(newIcon)
                    } else {
                        newIcon.className = currentStar.dataset["empty"];
                        currentStar.append(newIcon)
                    }
                }
            }
        })
    }
}

export const movieService = {
    getMovieReviews
}