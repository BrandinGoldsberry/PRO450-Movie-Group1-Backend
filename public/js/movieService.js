const movie_genres = [{
    "id": 28,
    "name": "Action"
},
{
    "id": 12,
    "name": "Adventure"
},
{
    "id": 16,
    "name": "Animation"
},
{
    "id": 35,
    "name": "Comedy"
},
{
    "id": 80,
    "name": "Crime"
},
{
    "id": 99,
    "name": "Documentary"
},
{
    "id": 18,
    "name": "Drama"
},
{
    "id": 10751,
    "name": "Family"
},
{
    "id": 14,
    "name": "Fantasy"
},
{
    "id": 36,
    "name": "History"
},
{
    "id": 27,
    "name": "Horror"
},
{
    "id": 10402,
    "name": "Music"
},
{
    "id": 9648,
    "name": "Mystery"
},
{
    "id": 10749,
    "name": "Romance"
},
{
    "id": 878,
    "name": "Science Fiction"
},
{
    "id": 10770,
    "name": "TV Movie"
},
{
    "id": 53,
    "name": "Thriller"
},
{
    "id": 10752,
    "name": "War"
},
{
    "id": 37,
    "name": "Western"
}]

const toggleReviews = (element) => {
    let isOpen = element.dataset.open == "true";
    if(!isOpen) {
        let pHeight = element.scrollHeight > 300 ? 400 : element.scrollHeight;
        element.style.transform = `translateY(0px)`;
        element.parentElement.style.height = `${pHeight}px`;
        element.dataset.open = "true";
    } else {
        let height = element.scrollHeight > 300 ? 400 : element.scrollHeight;
        element.style.transform = `translateY(${height * -1}px)`;
        element.parentElement.style.height = '0px';
        element.dataset.open = "false";
    }
    if(Cookies.get("id")) {
        if(isOpen) {
            element.children[0].className = "new-review hide-show hide";
            setTimeout(() => {element.children[0].className = "new-review hide-show disabled hide";}, 505)
            element.dataset.open = "false";
        } else {
            element.children[0].className = "new-review hide-show show";
            element.dataset.open = "true"
        }
    } else {
        element.children[0].className = "new-review disabled hide-show show";
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
            
            let poster = card.children[2];
            poster.addEventListener('click', (e) => {
                location.assign("/movie/" + card.dataset.movieid);
            })

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
            let hideHeight = res.data.reviews.length * -100;
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
        } else {
            let poster = card.children[2];
            poster.addEventListener('click', (e) => {
                location.assign("/movie/" + card.dataset.movieid);
            })
            let reviewList = document.getElementById("review-list-" + card.dataset.movieid);
            let hideHeight = -100;
            reviewList.dataset.open = false;
            reviewList.style.transform = `translateY(${hideHeight}px)`;
            reviewList.parentElement.style.height = '0px';
            reviewList.parentElement.parentElement.children[4].children[1].addEventListener('click', () => {
                toggleReviews(reviewList);
            })
        }
    })
}

const setSingleMovieReviews = (reviewList) => {
    axios.get("/reviews/reviews-by-movie?movieId=" + reviewList.dataset.movieid).then(res => { 
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
            
            let cardAvgRating = reviewList.parentElement.previousSibling.firstChild.firstChild;
            cardAvgRating.dataset.ratingval = avgRating;
            cardAvgRating.nextSibling.innerText = ratings.length + " ratings";

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
    if(location.href.indexOf("movie") > -1) {
        let reviewList = document.getElementsByClassName("reviews-list")[0];
        setSingleMovieReviews(reviewList);
    }
}

const updateSearchType = () => {
    let input = document.getElementById("movieQueryInput");
    switch (document.getElementById("searchTypeSelect").value) {
        case "Actor":
            let newInput = document.createElement("input");
            newInput.id = "movieQueryInput";
            newInput.type = "text";
            newInput.name = "search";
            newInput.placeholder = "Search Movie by Actor";
            input.replaceWith(newInput);
            break;
        case "Genre":
            let newSelect = document.createElement("select");
            newSelect.id = "movieQueryInput";
            newSelect.name = "search";
            for (const genre of movie_genres) {
                let newOp = document.createElement("option");
                newOp.value = genre.id;
                newOp.innerText = genre.name;
                newSelect.append(newOp);
            }
            input.replaceWith(newSelect);
            break;
        case "Title":
            let newTitleInput = document.createElement("input");
            newTitleInput.id = "movieQueryInput";
            newTitleInput.type = "text";
            newTitleInput.name = "search";
            newTitleInput.placeholder = "Search Movie by Title";
            input.replaceWith(newTitleInput);
            break;
        default:
            break;
    }
}

const search = async () => {
    let searchType = document.getElementById("searchTypeSelect").value;
    let searchQuery = document.getElementById("movieQueryInput").value;
    if(searchType !== "" && searchQuery !== "") {
        location.assign(`/search?searchType=${searchType}&q=${searchQuery}`)
    }
}

const initEditableStars = (stars) => {
    const calcStarPreview = (e) => {
        var arr = Array.prototype.slice.call(stars.children)
        let curHover = arr.indexOf(e.target.parentElement);
        return curHover;
    }

    const updateStarPreview = (starVals) => {
        for (let i = 0; i <= 4; i++) {
            let currentStar = stars.children[i];
            if(currentStar.children[0]) {
                if(i <= starVals) {
                    currentStar.children[0].className = currentStar.dataset["full"];
                } else {
                    currentStar.children[0].className = currentStar.dataset["empty"];
                }
            } else {
                let newIcon = document.createElement("i");
                if(i <= starVals) {
                    newIcon.className = currentStar.dataset["full"];
                } else {
                    newIcon.className = currentStar.dataset["empty"];
                }
                currentStar.append(newIcon)
            }
        }
    }

    const clearStars = (e) => {
        updateStarPreview(-1);
    }

    const updateStars = (e) => {
        let starVals = calcStarPreview(e);
        updateStarPreview(starVals);
    }

    for (let i = 1; i <= 5; i++) {
        let currentStar = stars.children[i - 1];
        currentStar.innerHTML = "";
        let newIcon = document.createElement("i");
        newIcon.className = currentStar.dataset["empty"];
        currentStar.append(newIcon)
        currentStar.addEventListener("mouseover", updateStars);

        currentStar.addEventListener("click", (e) => {
            let starVals = calcStarPreview(e);
            console.log(e);
            stars.removeEventListener("mouseout", clearStars);
            stars.addEventListener("mouseout", (e) => {
                updateStarPreview(starVals);
            })
            stars.dataset.ratingval = starVals + 1;
        });
    }
    stars.addEventListener("mouseout", clearStars);

}

const initializeNewReview = async (newReview) => {
    //init star rating
    let starsDOM = newReview.children[0];
    initEditableStars(starsDOM);

    let reviewTextDOM = newReview.children[1];
    newReview.children[2].addEventListener("click", (e) => {
        axios.post("/reviews/post-review", {
            email: Cookies.get("email"),
            reviewText: reviewTextDOM.value,
            rating: starsDOM.dataset.ratingval,
            movieId: starsDOM.dataset.movieid,
            username: Cookies.get("username")
        }).then((res) => {
            let reviewList = newReview.parentElement;
            console.log(reviewList);
            let reviewNode = document.createElement("div");
            reviewNode.className = "user-review";
            
            let reviewText = document.createElement("p");
            reviewText.innerText = `"${reviewTextDOM.value}"`;
            
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
            reviewSignature.innerText = ` - ${Cookies.get("username")}`;
            
            reviewNode.append(reviewText);
            reviewNode.append(reviewStars);
            reviewNode.append(reviewSignature);
            reviewList.append(reviewNode);
            let fullStars = starsDOM.dataset.ratingval;
            let halfStars = 0;
            let maxheight = reviewList.scrollHeight > 300 ? 400 : reviewList.scrollHeight;
            reviewList.parentElement.style.height = maxheight * -1;

            setStarValues(reviewStars, fullStars, halfStars);
        }).catch((err) => {

        });
    })
}

const initializeNewReviews = async () => {
    if(Cookies.get("id")) {
        let newReviews = document.getElementsByClassName("new-review");
        for (const newReview of newReviews) {
            newReview.className = "new-review";
            // newReview.parentElement.parentElement.className = "reviews-mask disable-scroll"
            if(location.href.indexOf("movie") > -1) {
                newReview.parentElement.parentElement.className = "reviews-mask disable-scroll"
            }
            initializeNewReview(newReview);
        }
    }
}

export const movieService = {
    getMovieReviews,
    search,
    initializeNewReviews,
    updateSearchType
}