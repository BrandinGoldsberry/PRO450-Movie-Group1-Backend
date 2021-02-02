const toggleReviews = (element) => {
    let isOpen = element.dataset.open == "true";
    if(!isOpen) {
        let height = element.dataset.hideheight;
        element.style.transform = `translateY(0px)`;
        element.parentElement.style.height = `${height * -1}px`;
    } else {
        let height = element.dataset.hideheight;
        element.style.transform = `translateY(${height}px)`;
        element.parentElement.style.height = '0px';
    }
    element.dataset.open = !isOpen;
}

const setStarValues = async (currentSet, fullStars, halfStars) => {
    for (let i = 1; i <= 5; i++) {
        let currentStar = currentSet.children[i - 1];
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

const setReviewValues = async (parentElement, review) => {
    let reviewText = document.createElement("p");
    reviewText.innerText = `"${review.review}"`;

    let reviewStars = document.createElement("div");
    reviewStars.className = "stars";

    for(let i in [0, 1, 2, 3, 4]) {
        let star = document.createElement("span");
        star.className = "ratingStar";
        star.dataset["full"] = "fa fa-star";
        star.dataset["half"] = "fa fa-star-half-alt";
        star.dataset["empty"] = "far fa-star";
        reviewStars.append(star);
    }

    let reviewSignature = document.createElement("p");
    reviewSignature.innerText = ` - ${review.username}`;

    parentElement.append(reviewText);
    parentElement.append(reviewStars);
    parentElement.append(reviewSignature);
    let fullStars = Math.floor(review.rating.$numberDecimal);
    let halfStars = review.rating.$numberDecimal % 1 != 0 ? 1 : 0;
    
    setStarValues(reviewStars, fullStars, halfStars);
}

const createReviewList = async (reviewList, reviews) => {
    for (const review of reviews) {
        let reviewNode = document.createElement("div");
        reviewNode.className = "user-review";
        reviewList.append(reviewNode);
        setReviewValues(reviewNode, review);
    }
}

const setCardInfo = async (card) => {
    axios.get("/reviews/reviews-by-movie?movieId=" + card.dataset.movieid).then(res => {
        if(!res.data.error) {
            const ratings = Object.values(res.data.reviews).map(review => parseFloat(review.rating.$numberDecimal));
            let avgRating = (ratings.reduce((r1, r2) => r1 + r2) / ratings.length);
            let avgRatingDec = (avgRating % 1);
            if(avgRatingDec > 0.75) {
                avgRatingDec = Math.ceil(avgRating);
            } else if (avgRatingDec < 0.25) {
                avgRating = Math.floor(avgRating);
            } else {
                avgRating = Math.floor(avgRating) + 0.5;
            }
            
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
            
            let reviewList = document.getElementById("review-list-" + card.dataset.movieid);
            let hideHeight = res.data.reviews.length * -150;
            reviewList.dataset.hideheight = hideHeight;
            reviewList.dataset.open = false;
            reviewList.style.transform = `translateY(${hideHeight}px)`;
            reviewList.parentElement.style.height = '0px';
            reviewList.parentElement.parentElement.children[4].children[1].addEventListener('click', () => {
                toggleReviews(reviewList);
            })

            let curRating = avgRating;

            let fullStars = Math.floor(curRating);
            let halfStars = curRating % 1 != 0 ? 1 : 0;
            //emptyStars = Math.floor(5 - curRating);
            setStarValues(cardAvgRating, fullStars, halfStars);
            createReviewList(reviewList, res.data.reviews);
        }
    })
}

const getMovieReviews = () => {
    let cards = document.getElementsByClassName("movie-card");
    for (const card of cards) {
        setCardInfo(card);
    }
}

const updateSearchType = () => {
    switch (document.getElementById("searchTypeSelect").value) {
        case "Actor":
            
            break;
        case "Genre":
            
            break;
        case "Title":
            
            break;
        default:
            break;
    }
}

const search = async () => {
    let searchType = document.getElementById("searchTypeSelect").value;
    let searchQuery = document.getElementById("movieTitleInput").value;
    if(searchType !== "" && searchQuery !== "") {
        location.assign(`/search?searchType=${searchType}&q=${searchQuery}`)
    }
}

export const movieService = {
    getMovieReviews,
    search
}