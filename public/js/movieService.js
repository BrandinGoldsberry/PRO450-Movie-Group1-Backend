const toggleReviews = (element) => {
    let isOpen = element.dataset.open == "true";
    if(!isOpen) {
        let height = element.dataset.hideheight;
        element.style.transform = `translateY(0px)`;
        element.parentElement.style.height = `auto`;
    } else {
        let height = element.dataset.hideheight;
        element.style.transform = `translateY(${height}px)`;
        setTimeout(() => {
            element.parentElement.style.height = '0px';
        }, 401);
    }
    if(isOpen && Cookies.get("id")) {
        element.parentElement.nextSibling.className = "new-review hide-show hide";
        setTimeout(() => {element.parentElement.nextSibling.className = "new-review hide-show disabled hide";}, 505)
    } else {
        element.parentElement.nextSibling.className = "new-review hide-show show";
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
            let reviewList = newReview.previousSibling.children[0];
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
            
            setStarValues(reviewStars, fullStars, halfStars);
        }).catch((err) => {

        });
    })
}

const initializeNewReviews = async () => {
    if(Cookies.get("id")) {
        let newReviews = document.getElementsByClassName("new-review");
        for (const newReview of newReviews) {
            newReview.className = "new-review disabled hide";
            initializeNewReview(newReview);
        }
    }
}

export const movieService = {
    getMovieReviews,
    search,
    initializeNewReviews
}