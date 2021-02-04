const search = async () => {
    cleanUp();
    userCleanUp();
    const searchInput = document.getElementById("adminDashboard-search-input")
    const searchSelect = document.getElementById("adminDashboard-search-select")
    const searchInputValue = searchInput.value;
    const searchSelectValue = searchSelect.value;

    const tableAD = document.getElementById("adminTable");

    if (searchSelectValue && searchInputValue) {
        const res = await axios.get(`http://localhost:5001/users/find-users-by-${searchSelectValue}?search=${searchInputValue}`);
        // console.log(res.data.users)
        const userList = res.data.users
        for (const user in userList) {
            if (Object.hasOwnProperty.call(userList, user)) {
                const element = userList[user];

                var newRow = tableAD.insertRow();
                newRow.setAttribute("data-user-id", element["_id"])
                newRow.className = "adminTable-row"

                var usernameCell = newRow.insertCell()
                usernameCell.className = "adminTable-cell adminTable-cell-username"
                usernameCell.innerHTML = element["username"]


                var fnameCell = newRow.insertCell()
                fnameCell.className = "adminTable-cell adminTable-cell-fname"
                fnameCell.innerHTML = element["fname"]

                var lnameCell = newRow.insertCell()
                lnameCell.className = "adminTable-cell adminTable-cell-lname"
                lnameCell.innerHTML = element["lname"]

                var emailCell = newRow.insertCell()
                emailCell.className = "adminTable-cell adminTable-cell-email"
                emailCell.innerHTML = element["email"]

                newRow.addEventListener("click", (e) => { getUserInfo(e) });
            }
        }

    }
}

const getUserInfo = async (e) => {
    userCleanUp();
    const element = e.currentTarget;
    const userId = element.getAttribute("data-user-id");
    var reviewDiv = document.getElementById("adminDashboard-review-div");
    const resUser = await axios.post(`http://localhost:5001/users/is-user-admin?userId=${userId}`);
    const user = resUser.data || undefined;

    console.log(user)

    if(user){
        if(!user.superAdmin){
            
        }
    }

    // console.log(userId)
    const resUserReviews = await axios.get(`http://localhost:5001/reviews/get-reviews-by-user?userId=${userId}`)
    const userReviews = resUserReviews.data.result;
    const userReviewData = resUserReviews.data;
    if (typeof userReviewData === 'string' || userReviewData instanceof String) {
        var header = document.createElement("h1");
        header.id = "adminDashboard-review-header"
        header.innerHTML = "Reviews";
        reviewDiv.appendChild(header)

        var createSpan = document.createElement("span");
        createSpan.id = "adminDashboard-review-empty-span";
        var textNode = document.createTextNode(userReviewData);
        createSpan.appendChild(textNode)

        reviewDiv.appendChild(createSpan)
    } else {
        // console.log(userReviews)
        // console.log(userReviews.length)
        var reviewDiv = document.getElementById("adminDashboard-review-div");

        var header = document.createElement("h1");
        header.id = "adminDashboard-review-header"
        header.innerHTML = "Reviews";
        reviewDiv.appendChild(header)

        for (const review in userReviews) {
            if (Object.hasOwnProperty.call(userReviews, review)) {
                const element = userReviews[review];
                // console.log(element)
                var movieTitle = await getMovieTitle(element["movieId"]);
                // console.log(movieTitle)
                var rating = element["rating"]["$numberDecimal"];
                // console.log(element["rating"]["$numberDecimal"])
                var reviewText = element["review"];
                // console.log(element["review"])
                var username = element["username"];
                // console.log(element["username"])


                var createCardDiv = document.createElement("div");
                createCardDiv.className = "adminDashboard-card"
                createCardDiv.setAttribute("data-review-id", element["_id"]);
                createCardDiv.setAttribute("data-review-username", username);
                createCardDiv.setAttribute("data-review-movie-title", movieTitle);
                createCardDiv.setAttribute("data-review-user-id", userId);
                reviewDiv.appendChild(createCardDiv)

                createElement("h2", "adminDashboard-card-header", null, `Movie Title - ${movieTitle}`, createCardDiv);

                //Rating Needed

                createElement("p", "adminDashboard-card-reviewText", null, `&quot;${reviewText}&quot;`, createCardDiv);
                createElement("p", "adminDashboard-card-username", null, `- ${username}`, createCardDiv);


                var createReviewDeleteButton = document.createElement("button");
                createReviewDeleteButton.className = "adminDashboard-card-delete";
                createReviewDeleteButton.innerHTML = "Delete Review";
                createReviewDeleteButton.addEventListener("click", (e) => { deleteReview(e) });
                createCardDiv.appendChild(createReviewDeleteButton);

            }
        }
    }
};

const createElement = (elementType, className, idName, text, parentElement) => {
    var element = document.createElement(elementType);
    if (className) {
        element.className = className;
    }
    if (idName) {
        element.id = idName;
    }
    element.innerHTML = text;
    parentElement.appendChild(element);
}

const cleanUp = () => {
    var adminTable = document.getElementById("adminTable");
    var adminTableRows = (adminTable.rows.length);

    for (let i = 1; i < adminTableRows; i++) {
        ;
        adminTable.deleteRow(1);
    }

}

const userCleanUp = () => {
    var reviewDiv = document.getElementById("adminDashboard-review-div") || null;
    if (reviewDiv) {
        while (reviewDiv.firstChild) {
            reviewDiv.removeChild(reviewDiv.firstChild);
        }
    }
}

const getMovieTitle = async (id) => {
    // console.log(id);
    const movie = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=8fbd2bfef8820b20b271b1213852fe21&language=en-US`)
    var title = movie.data.title;

    return title;
}

const deleteReview = (e) => {
    const element = e.target;
    const parent = element.parentElement;
    const containgParent = document.getElementById("adminDashboard-review-div");
    const userId = parent.getAttribute("data-review-user-id");
    const username = parent.getAttribute("data-review-username");
    const movieTitle = parent.getAttribute("data-review-movie-title");
    const reviewId = parent.getAttribute("data-review-id");
    // console.log(reviewId);

    containgParent.removeChild(parent);

    // //Axios Call
    // console.log(reviewId);
    axios.delete(`http://localhost:5001/reviews/delete-review?reviewId=${reviewId}`).then(
        alert(`You have deleted ${username}'s review of ${movieTitle}`)
    ).catch((error) => {
        console.error(error);
    });

}

export const adminDashboard = {
    search
}