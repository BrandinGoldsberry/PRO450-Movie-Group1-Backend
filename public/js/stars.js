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

const initializeStars = () => {
    let stars = document.getElementsByClassName("stars");
    for (const starSet of stars) {
        //Get Rating of the star set
        let curRating = starSet.dataset.ratingval;
        
        let fullStars = Math.floor(curRating);
        let halfStars = curRating % 1 != 0 ? 1 : 0;
        //emptyStars = Math.floor(5 - curRating);
        
        setStarValues(starSet, fullStars, halfStars);
    }
}

export const stars = {
    initializeStars,
}