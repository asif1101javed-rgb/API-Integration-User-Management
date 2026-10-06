const userContainer = document.getElementById("userContainer");
const searchInput = document.getElementById("searchInput");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const pagination = document.getElementById("pagination");
const totalUsers = document.getElementById("totalUsers");
const pageInfo = document.getElementById("pageInfo");

// ========================================
// API
// ========================================

const API_URL =
"https://fakestoreapi.noksha.dev/api/users";

// ========================================
// VARIABLES
// ========================================

let users = [];

let currentPage = 1;

let totalPage = 1;

// ========================================
// GET USERS
// ========================================

const getUsers = async (page = 1) => {

try {

    loading.style.display = "flex";

    error.style.display = "none";


    // IMPORTANT:
    // Send page number to API

    const response = await fetch(
        `${API_URL}?page=${page}`
    );


    if (!response.ok) {

        throw new Error("API Error");

    }


    const data = await response.json();


    console.log("API Response:", data);


    // ====================================
    // STORE DATA
    // ====================================

    users = data.data || [];


    currentPage =
        data.currentPage || page;


    totalPage =
        data.totalPages || 1;


    // ====================================
    // TOTAL USERS
    // ====================================

    totalUsers.innerText =
        data.totalUsers || users.length;


    // ====================================
    // DISPLAY
    // ====================================

    displayUsers(users);


    // ====================================
    // PAGINATION
    // ====================================

    createPagination();

}

catch (err) {

    console.error(err);

    error.innerText =
        "Failed to fetch users. Please try again.";

    error.style.display = "block";

}

finally {

    loading.style.display = "none";

}

};

// ========================================
// DISPLAY USERS
// ========================================

const displayUsers = (data) => {

userContainer.innerHTML = "";


if (!data || data.length === 0) {

    userContainer.innerHTML = `

        <div class="no-users">

            <div class="no-users-icon">
                👤
            </div>

            <h2>
                No Users Found
            </h2>

            <p>
                Try searching with a different keyword.
            </p>

        </div>

    `;

    return;

}


data.forEach((user) => {

    const card =
        document.createElement("article");


    card.classList.add("user-card");


    const firstLetter =
        user.name
            ? user.name.charAt(0).toUpperCase()
            : "?";


    card.innerHTML = `

        <div class="user-top">

            <div class="avatar">
                ${firstLetter}
            </div>


            <div class="user-info">

                <h2>
                    ${user.name}
                </h2>

                <span>
                    @${user.username}
                </span>

            </div>


            <span class="status ${user.status.toLowerCase()}">
                ${user.status}
            </span>

        </div>


        <div class="user-details">


            <div class="detail">

                <span class="detail-label">
                    Email
                </span>

                <strong>
                    ${user.email}
                </strong>

            </div>


            <div class="detail">

                <span class="detail-label">
                    Phone
                </span>

                <strong>
                    ${user.phone}
                </strong>

            </div>


            <div class="detail">

                <span class="detail-label">
                    Location
                </span>

                <strong>
                    ${user.address?.city || "Unknown"}
                </strong>

            </div>


            <div class="detail">

                <span class="detail-label">
                    Role
                </span>

                <strong class="role">
                    ${user.role}
                </strong>

            </div>

        </div>


        <div class="user-footer">

            <span>
                ID: #${user._id}
            </span>


            ${
                user.website
                ?
                `
                <a
                    href="https://${user.website}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Website ↗
                </a>
                `
                :
                ""
            }

        </div>

    `;


    userContainer.appendChild(card);

});

};

// ========================================
// PAGINATION
// ========================================

function createPagination() {

pagination.innerHTML = "";


pageInfo.innerText =
    `Page ${currentPage} of ${totalPage}`;


// ====================================
// PREVIOUS
// ====================================

const previousButton =
    document.createElement("button");


previousButton.innerText =
    "Previous";


previousButton.disabled =
    currentPage === 1;


previousButton.addEventListener(
    "click",
    () => {

        if (currentPage > 1) {

            getUsers(
                currentPage - 1
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }

    }
);


pagination.appendChild(
    previousButton
);


// ====================================
// PAGE NUMBERS
// ====================================

function addPageButton(page) {

    const button =
        document.createElement("button");


    button.innerText = page;


    if (page === currentPage) {

        button.classList.add("active");

    }


    button.addEventListener(
        "click",
        () => {

            if (page !== currentPage) {

                getUsers(page);

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        }
    );


    pagination.appendChild(button);

}


// ====================================
// PAGINATION LOGIC
// ====================================

if (totalPage <= 5) {

    for (
        let page = 1;
        page <= totalPage;
        page++
    ) {

        addPageButton(page);

    }

}

else {

    addPageButton(1);


    if (currentPage <= 3) {

        addPageButton(2);
        addPageButton(3);
        addPageButton(4);


        const dots =
            document.createElement("span");

        dots.innerText = "...";

        pagination.appendChild(dots);

    }

    else if (
        currentPage > 3 &&
        currentPage < totalPage - 2
    ) {

        const dots =
            document.createElement("span");

        dots.innerText = "...";

        pagination.appendChild(dots);


        addPageButton(
            currentPage - 1
        );

        addPageButton(
            currentPage
        );

        addPageButton(
            currentPage + 1
        );


        const dots2 =
            document.createElement("span");

        dots2.innerText = "...";

        pagination.appendChild(dots2);

    }

    else {

        const dots =
            document.createElement("span");

        dots.innerText = "...";

        pagination.appendChild(dots);


        addPageButton(
            totalPage - 3
        );

        addPageButton(
            totalPage - 2
        );

        addPageButton(
            totalPage - 1
        );

    }


    addPageButton(totalPage);

}


// ====================================
// NEXT
// ====================================

const nextButton =
    document.createElement("button");


nextButton.innerText =
    "Next";


nextButton.disabled =
    currentPage === totalPage;


nextButton.addEventListener(
    "click",
    () => {

        if (currentPage < totalPage) {

            getUsers(
                currentPage + 1
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }

    }
);


pagination.appendChild(
    nextButton
);

}

// ========================================
// SEARCH
// ========================================

searchInput.addEventListener(
"input",
() => {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    // EMPTY SEARCH

    if (searchText === "") {

        displayUsers(users);

        return;

    }


    // FILTER

    const filteredUsers =
        users.filter((user) => {

            const name =
                user.name?.toLowerCase() || "";


            const username =
                user.username?.toLowerCase() || "";


            const email =
                user.email?.toLowerCase() || "";


            const role =
                user.role?.toLowerCase() || "";


            const status =
                user.status?.toLowerCase() || "";


            const city =
                user.address?.city?.toLowerCase() || "";


            return (

                name.includes(searchText)

                ||

                username.includes(searchText)

                ||

                email.includes(searchText)

                ||

                role.includes(searchText)

                ||

                status.includes(searchText)

                ||

                city.includes(searchText)

            );

        });


    displayUsers(filteredUsers);

}

);

// ========================================
// INITIAL LOAD
// ========================================

getUsers();