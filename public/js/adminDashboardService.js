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
                newRow.setAttribute("data-user-username", element["username"])
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
    var buttonDiv = document.getElementById("adminDashboard-button-div");
    var reviewDiv = document.getElementById("adminDashboard-review-div");
    var continaingDiv = reviewDiv.parentElement
    const resUser = await axios.post(`http://localhost:5001/users/is-user-admin?userId=${userId}`);
    const user = resUser.data || undefined;
    const currentUserId = Cookies.get("id");
    const username = element.getAttribute("data-user-username");

    continaingDiv.setAttribute("data-user-username", username)
    continaingDiv.setAttribute("data-user-id", userId)
    continaingDiv.setAttribute("data-user-current-id", currentUserId)
    continaingDiv.setAttribute("data-user-admin", String(user["admin"]));
    continaingDiv.setAttribute("data-user-super-admin", String(user["superAdmin"]));

    // console.log(username);

    // console.log(user)

    getUserButtons(user, userId, currentUserId, username);

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


                var deleteReviewButton = document.createElement("button");
                deleteReviewButton.className = "adminDashboard-card-delete-review";
                deleteReviewButton.innerHTML = "Delete Review";
                deleteReviewButton.addEventListener("click", (e) => { deleteReview(e) });
                createCardDiv.appendChild(deleteReviewButton);
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

const getUserButtons = (user, userId, currentUserId, username) => {
    console.log(user["admin"],user["superAdmin"] , userId, currentUserId, username);
    var buttonDiv = document.getElementById("adminDashboard-button-div");
    const isUserSuperAdmin = Boolean(Cookies.get("superadmin"));
    // console.log(isUserSuperAdmin);
    if (userId != currentUserId) {
        console.log("Isn't Current User")
        if (!user["superAdmin"] && user["admin"] || !user["superAdmin"] && !user["admin"]) {
            console.log("Delete User")
            var deleteUserButton = document.createElement("button");
            deleteUserButton.className = "adminDashboard-card-delete-review-user";
            deleteUserButton.innerHTML = "Delete User";
            deleteUserButton.setAttribute("data-user-username", username);
            deleteUserButton.setAttribute("data-user-id", currentUserId);
            deleteUserButton.addEventListener("click", (e) => { deleteUserCheck(e) });
            buttonDiv.appendChild(deleteUserButton);
        }
        if (isUserSuperAdmin) {
            if (!user["superAdmin"] && user["admin"]) {
                console.log("Remove Admin User")
                var removeAdminButton = document.createElement("button");
                removeAdminButton.className = "adminDashboard-card-remove-admin";
                removeAdminButton.innerHTML = "Remove Admin Privileges";
                removeAdminButton.setAttribute("data-user-username", username);
                removeAdminButton.setAttribute("data-user-id", currentUserId);
                removeAdminButton.addEventListener("click", (e) => { removeAdminCheck(e) });
                buttonDiv.appendChild(removeAdminButton);
            }
            if (!user["superAdmin"] && !user["admin"]) {
                console.log("Add Admin User")
                var addAdminButton = document.createElement("button");
                addAdminButton.className = "adminDashboard-card-add-admin";
                addAdminButton.innerHTML = "Add Admin Privileges";
                addAdminButton.setAttribute("data-user-username", username);
                addAdminButton.setAttribute("data-user-id", currentUserId);
                addAdminButton.addEventListener("click", (e) => { addAdminCheck(e) });
                buttonDiv.appendChild(addAdminButton);
            }
        }
    }
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
    var buttonDiv = document.getElementById("adminDashboard-button-div") || null;
    if (buttonDiv) {
        while (buttonDiv.firstChild) {
            buttonDiv.removeChild(buttonDiv.firstChild);
        }
    }

    var reviewDiv = document.getElementById("adminDashboard-review-div") || null;
    if (reviewDiv) {
        while (reviewDiv.firstChild) {
            reviewDiv.removeChild(reviewDiv.firstChild);
        }
    }
}

const buttonCleanUp = () => {
    var buttonDiv = document.getElementById("adminDashboard-button-div") || null;
    if (buttonDiv) {
        while (buttonDiv.firstChild) {
            buttonDiv.removeChild(buttonDiv.firstChild);
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

const deleteUserCheck = (e) => {
    createConfSet(e, 1, "delete", "Are you sure you want to delete", null);
}

const deleteUser = (e) => {
    const element = e.target;
    const currentId = element.getAttribute("data-user-id")
    // console.log(currentId)
}

const removeAdminCheck = (e) => {
    createConfSet(e, 0, "remove", "Are you sure you want to remove", "admin privileges")
}

const removeAdmin = (e) => {
    const element = e.target;
    const currentId = element.getAttribute("data-user-id")
    // console.log(currentId)
}

const addAdminCheck = (e) => {
    createConfSet(e, 0, "add", "Are you sure you want to give", "admin privileges")
}

const addAdmin = async (e) => {
    const element = e.target;
    const parent = element.parentElement.parentElement;
    const username = parent.getAttribute("data-user-username");
    const id = parent.getAttribute("data-user-id");
    const currentId = parent.getAttribute("data-user-current-id");
    const admin = Boolean(parent.getAttribute("data-user-admin"));
    const superAdmin = Boolean(parent.getAttribute("data-user-super-admin"));

    console.log({superAdmin, admin});

    console.log(currentId)
    var addAdminRes = await axios.get(`http://localhost:5001/users/make-admin?userId=${id}`);
    if(addAdminRes.status == 200){
        console.log("Hello")
        buttonCleanUp();
        await getUserButtons({superAdmin: false, admin}, id, currentId, username);
    }

}



const createConfSet = (e, otherItemIndex, action, headerMessage, headerMessageTwo) => {
    const element = e.target;
    const userUsername = element.getAttribute("data-user-username");
    const currentUserId = element.getAttribute("data-user-id")
    const parent = element.parentElement;
    const childButton = parent.children.item(otherItemIndex);

    parent.removeChild(childButton);
    parent.removeChild(element);

    var confirmText = document.createElement("h2");
    confirmText.className = `adminDashboard-card-${action}-admin-text`;
    if (headerMessageTwo && action == "remove") {
        var userUsernameFormat = userUsername[-1] === 's' ? `${userUsername}'` : `${userUsername}'s`
        confirmText.innerHTML = `${headerMessage} <span class="adminDashboard-card-${action}-admin-span">${userUsernameFormat}</span> ${headerMessageTwo}?`;
    } else if(!headerMessageTwo && action == "delete"){
        confirmText.innerHTML = `${headerMessage} ${userUsername}?`;
    } else if(headerMessageTwo && action == "add"){
        confirmText.innerHTML = `${headerMessage} <span class="adminDashboard-card-${action}-admin-span">${userUsername}</span> ${headerMessageTwo}?`;

    }
    parent.appendChild(confirmText);

    var confirmButton = document.createElement("button");
    confirmButton.className = `adminDashboard-card-${action}-admin-confirm`;
    confirmButton.innerHTML = "Confirm";
    confirmButton.setAttribute("data-user-id", currentUserId)
    if (action == "remove") {
        confirmButton.addEventListener("click", (e) => { removeAdmin(e) });
    } else if (action == "delete") {
        confirmButton.addEventListener("click", (e) => { deleteUser(e) });
    } else if (action == "add") {
        console.log("add");
        confirmButton.addEventListener("click", (e) => { addAdmin(e) });
    }
    parent.appendChild(confirmButton);


    var cancelButton = document.createElement("button");
    cancelButton.className = `adminDashboard-card-${action}-admin-cancel`;
    cancelButton.innerHTML = "Cancel ";
    cancelButton.addEventListener("click", () => {
        parent.removeChild(confirmText);
        parent.removeChild(confirmButton);
        parent.removeChild(cancelButton);
        if (action == "delete") {
            parent.appendChild(element);
            parent.appendChild(childButton);
        } else {
            parent.appendChild(childButton);
            parent.appendChild(element);
        }

    });
    parent.appendChild(cancelButton);
}

export const adminDashboard = {
    search
}