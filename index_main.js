const GlobalDataManager = (() => {
    const solutionsApiBaseUrl = "https://solutions-test.recruitcrm.io/";
    const accountId = "8304af2b-ffa0-4cd8-b211-058aa611e198";
    const initialJobs = {};
    const displayedJobs = {};
    const nextPageUrl = "";
    const filterObject = {};
    const jobsUpdated = false;
    const userInfo = {};

    return {
        solutionsApiBaseUrl,
        accountId,
        initialJobs,
        displayedJobs,
        nextPageUrl,
        filterObject,
        jobsUpdated,
        userInfo,
    };
})();

const LoadManager = (() => {
    let loadContainer = document.getElementById("loaderContainer");
    let sectionLoadContainer = document.getElementById(
        "sectionLoaderContainer"
    );

    const show = () => {
        loadContainer.style.display = "flex";
    };

    const hide = () => {
        loadContainer.style.display = "none";
    };

    const showSectionLoader = () => {
        sectionLoadContainer.style.display = "flex";
    };

    const hideSectionLoader = () => {
        sectionLoadContainer.style.display = "none";
    };

    return {
        show,
        hide,
        showSectionLoader,
        hideSectionLoader,
    };
})();

const AnimationManager = (() => {
    const initialize = () => {
        document.addEventListener("scroll", triggerCardAnimation);
    };

    const triggerCardAnimation = () => {
        let jobCards = document.querySelectorAll(".job-card");
        jobCards.forEach(function (card) {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                card.classList.add("animate-cards");
            }
        });
    };

    const triggerAnimation = () => {
        document.body.classList.add("animate-header");
        setTimeout(() => {
            document.body.classList.add("animate-filters");
            setTimeout(() => {
                triggerCardAnimation();
            }, 500);
        }, 1000);
    };

    return {
        initialize,
        triggerAnimation,
        triggerCardAnimation,
    };
})();

const JobInformationManager = (() => {
    cardContainer = document.getElementById("cardContainer");

    const initialize = () => {
        fetchJobInformation();
    };

    const fetchJobInformation = async () => {
        try {
            const response = await fetch(
                GlobalDataManager.solutionsApiBaseUrl +
                    "jobs/" +
                    GlobalDataManager.accountId +
                    "?limit=10&keys=custom_field[2],custom_field[4],custom_field[12],owner"
            );
            if (!response.ok) {
                LoaderManager.hide();
                // JobClosedManager.initialize();
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            GlobalDataManager.initialJobs = data;
            populateJobCards(data);
            AnimationManager.triggerAnimation();
        } catch (error) {
            console.error("Fetch error: ", error.message);
            throw error;
        }
    };

    const populateJobCards = (jobsData) => {
        NoJobsManager.hideNoJobs();
        jobsData.data.forEach((job) => {
            let li = document.createElement("li");
            let card = document.createElement("a");
            card.setAttribute("href", "/job-description?id=" + job.job_id);
            card.href = "/job-description?id=" + job.job_id;
            card.target = "_blank";
            card.id = job.job_id;
            card.classList.add("job-card");
            imageSrc = "https://tandemsearch.com/wp-content/uploads/2023/10/owner_placeholder-scaled.jpg";
            if (Object.keys(GlobalDataManager.userInfo).length > 0) {
                url = GlobalDataManager.userInfo[job.owner];
                if (url != null) {
                    imageSrc = url;
                }
            }
            card.innerHTML = `
            <div class="job-details-wrapper">
                <div class="job-name-dept">
                    <h4 class="job-name">${job.name}</h4>
                    <p class="department-name">${
                        job.custom_fields.find(
                            (field) => field.field_id === "2"
                        ).value
                    }</p>
                </div>
                <div class="country-info">
                    <i class="ph ph-map-pin"></i>
                    <p class="country-name mb-0">${job.city} - ${
                job.country
            }</p>
                </div>
                <div class="job-type-info">
                    <i class="ph ph-identification-card"></i>
                    <p class="job-type mb-0">${
                        job.custom_fields.find(
                            (field) => field.field_id === "4"
                        ).value
                    }</p>
                </div>
                <div class="date-posted-info">
                    <i class="ph ph-calendar"></i>
                    <p class="date-posted mb-0">${convertDate(
                        job.custom_fields.find(
                            (field) => field.field_id === "12"
                        ).value
                    )}</p>
                </div>
            </div>
            <div class="job-owner-info">
                <img class="owner-image" src="${imageSrc}" alt="job owner" id=${
                job.owner
            }>
            </div>
        `;
            li.appendChild(card);
            cardContainer.appendChild(li);
        });

        if (
            jobsData.hasOwnProperty("next_page_url") &&
            jobsData.next_page_url != null &&
            !document.querySelector("#viewMore")
        ) {
            viewMore = document.createElement("div");
            viewMore.classList.add("view-more-btn-container");
            viewMore.classList.add("text-center");
            viewMore.id = "viewMore";
            viewMore.innerHTML = `
            <button class="button-rcrm button-view-more" id="viewMoreBtn">View more Jobs</button>
        `;
            cardContainer.appendChild(viewMore);
            GlobalDataManager.nextPageUrl = jobsData.next_page_url;
            document
                .getElementById("viewMoreBtn")
                .addEventListener("click", fetchNextPageJobs);
        }

        GlobalDataManager.displayedJobs = jobsData.data;
        if (GlobalDataManager.jobsUpdated)
            AnimationManager.triggerCardAnimation();
    };

    const fetchNextPageJobs = async () => {
        let viewMore = document.getElementById("viewMore");
        if (viewMore) {
            viewMore.parentNode.removeChild(viewMore);
        }
        // Scrolls down by 10 pixels
        try {
            const response = await fetch(GlobalDataManager.nextPageUrl);
            if (!response.ok) {
                // LoaderManager.hide();
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            GlobalDataManager.displayedJobs = data.data;
            populateJobCards(data);
            window.scrollBy({
                top: 250,
                behavior: "smooth",
            });
        } catch (error) {
            console.error("Fetch error: ", error.message);
            throw error;
        }
    };

    const convertDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return {
        initialize,
        populateJobCards,
    };
})();

const UserInformationManager = (() => {
    const initialize = async () => {
        const data = await fetchUserInfo();
        GlobalDataManager.userInfo = data.reduce((acc, curr) => {
            acc[curr.id] = curr.avatar;
            return acc;
        }, {});

        processUserInfo();
    };

    const fetchUserInfo = async () => {
        try {
            const response = await fetch(
                GlobalDataManager.solutionsApiBaseUrl +
                    "users/" +
                    GlobalDataManager.accountId
            );
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Fetch error: ", error.message);
            throw error;
        }
    };

    const processUserInfo = () => {
        if (Object.keys(GlobalDataManager.userInfo).length > 0) {
            let ownerImgs = document.querySelectorAll(".owner-image");
            ownerImgs.forEach((img) => {
                url = GlobalDataManager.userInfo[img.id];
                if (url != null) {
                    img.src = url;
                }
            });
        }
    };

    return {
        initialize,
        processUserInfo,
    };
})();

const DropdownsManager = (() => {
    let resetButton = document.getElementById("resetBtn");
    let countryDropdownButton = document.getElementById("countryDropdown");
    let industryDropdownButton =
        document.getElementById("industryDropdown");
    let cityDropdownButton = document.getElementById("cityDropdown");
    let searchInput = document.getElementById("searchInput");
    let citySelected = 0;
    let countrySelected = 0;
    let industrySelected = 0;

    const initialize = async () => {
        resetButton.addEventListener("click", resetFilters);
        let additionalData = await fetchAdditionalInfo();
        populateAdditionalInfo(additionalData);
        adjustDropdowns();
    };

    const fetchAdditionalInfo = async () => {
        try {
            const response = await fetch(
                GlobalDataManager.solutionsApiBaseUrl +
                    "jobs/additional-info/" +
                    GlobalDataManager.accountId +
                    "?keys=country,city,custom_field[2]"
            );
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Fetch error: ", error.message);
            throw error;
        }
    };

    const populateAdditionalInfo = (data) => {
        countryArray = [];
        cityArray = [];
        industryArray = [];

        data["unique_values"].forEach(function (item) {
            if (JSON.parse(item).hasOwnProperty("country")) {
                countryArray.push(JSON.parse(item).country.S);
            }
            if (JSON.parse(item).hasOwnProperty("custom_field[2]")) {
                industryArray.push(JSON.parse(item)["custom_field[2]"]);
            }
            if (JSON.parse(item).hasOwnProperty("city")) {
                cityArray.push(JSON.parse(item).city.S);
            }
        });

        countryArray.sort();
        cityArray.sort();
        industryArray.sort();

        countryArray.forEach(function (item) {
            if (item != "None" && item != "") {
                let listElement = document.createElement("li");
                inputId = "country" + generateIds(item);
                listElement.innerHTML = `
                <div class="dropdown-item">
                    <input class="checkbox" type="checkbox" value="${item}" id="${inputId}" onchange="DropdownsManager.handleCheckboxChange(this, 'country', '${item}')">
                    <label class="form-check-label" for="${inputId}">
                        ${item}
                    </label>
                </div>
            `;
                document
                    .getElementById("countryDropdownValues")
                    .appendChild(listElement);
            }
        });

        cityArray.forEach(function (item) {
            if (item != "None" && item != "") {
                let listElement = document.createElement("li");
                inputId = "city" + generateIds(item);
                listElement.innerHTML = `
                <div class="dropdown-item">
                    <input class="checkbox" type="checkbox" value="${item}" id="${inputId}" onchange="DropdownsManager.handleCheckboxChange(this, 'city', '${item}')">
                    <label class="form-check-label" for="${inputId}">
                        ${item}
                    </label>
                </div>
            `;
                document
                    .getElementById("cityDropdownValues")
                    .appendChild(listElement);
            }
        });

        industryArray.forEach(function (item) {
            if (item != "None" && item != "") {
                let listElement = document.createElement("li");
                inputId = "2" + generateIds(item);
                listElement.innerHTML = `
            <div class="dropdown-item">
            <input class="checkbox" type="checkbox" value="${item}" id="${inputId}" onchange="DropdownsManager.handleCheckboxChange(this, 2, '${item}')">
            <label class="form-check-label" for="${inputId}">
                ${item}
            </label>
        </div>
            `;
                document
                    .getElementById("industryDropdownValues")
                    .appendChild(listElement);
            }
        });

        fixDropdown();
    };

    const updatePills = () => {
        const pillsContainer = document.getElementById("pillsContainer");
        pillsContainer.innerHTML = "";

        for (const key in GlobalDataManager.filterObject) {
            if (GlobalDataManager.filterObject.hasOwnProperty(key)) {
                let values = [];

                if (key == "search_keyword") {
                    values.push(GlobalDataManager.filterObject[key]);
                } else {
                    values = GlobalDataManager.filterObject[key].split(",");
                }

                values.forEach(function (value) {
                    if (value != "") {
                        const pill = document.createElement("span");
                        pill.classList.add("pill");
                        pill.innerText = value;
                        const closeButton =
                            document.createElement("button");
                        closeButton.innerHTML = "&times;"; // Times symbol for cross-out
                        closeButton.addEventListener("click", function () {
                            removeFromFilterObject(key, value);
                            var addSearchKeyword = true;

                            if (key != "search_keyword") {
                                const checkboxes =
                                    document.getElementsByClassName(
                                        "checkbox"
                                    );
                                for (const checkbox of checkboxes) {
                                    if (
                                        checkbox.id === generateIds(value)
                                    ) {
                                        checkbox.checked = false;
                                        handleCheckboxChange(checkbox, key, value);
                                        break;
                                    }
                                }
                            } else {
                                searchInput.value = "";
                            }

                            if (
                                Object.keys(GlobalDataManager.filterObject)
                                    .length > 0
                            ) {
                                updatePills();
                                FilterManager.prepareFilterParams();
                            } else {
                                resetFilters();
                            }
                        });

                        pill.appendChild(closeButton);
                        pillsContainer.appendChild(pill);
                    }
                });
            }
        }
    };

    const showResetButton = () => {
        resetButton.style.display = "inline-block";
    };

    const addToFilterObject = (key, value) => {
        if (GlobalDataManager.filterObject.hasOwnProperty(key)) {
            GlobalDataManager.filterObject[key] += "," + value;
        } else {
            GlobalDataManager.filterObject[key] = value;
        }
    };

    const removeFromFilterObject = (key, value) => {
        if (GlobalDataManager.filterObject.hasOwnProperty(key)) {
            const values = GlobalDataManager.filterObject[key].split(",");
            const index = values.indexOf(value);
            if (index !== -1) {
                values.splice(index, 1);
                GlobalDataManager.filterObject[key] = values.join(",");
            }
            if (GlobalDataManager.filterObject[key] === "") {
                delete GlobalDataManager.filterObject[key];
            }
        }
    };

    const resetFilters = () => {
        countryDropdownButton.innerHTML = "Choose a Country";
        countryDropdownButton.classList.remove("selected");

        industryDropdownButton.innerHTML = "Choose an Industry";
        industryDropdownButton.classList.remove("selected");

        cityDropdownButton.innerHTML = "Choose a City";
        cityDropdownButton.classList.remove("selected");

        citySelected = 0;
        countrySelected = 0;
        industrySelected = 0;

        const checkboxes = document.querySelectorAll(".checkbox");

        checkboxes.forEach((checkbox) => {
            checkbox.checked = false;
        });

        GlobalDataManager.filterObject = {};
        updatePills();
        checkPillsContainerChildren();

        searchInput.value = "";

        if (GlobalDataManager.jobsUpdated) {
            cardContainer.replaceChildren();
            JobInformationManager.populateJobCards(
                GlobalDataManager.initialJobs
            );
            GlobalDataManager.jobsUpdated = false;
        }

        hideResetButton();
        LoadManager.hideSectionLoader();
    };

    const checkPillsContainerChildren = () => {
        const container = document.getElementById("pillsContainer");
        if (container.children.length > 0) {
            container.classList.add("reveal");
        } else {
            container.classList.remove("reveal");
        }
    };

    const hideResetButton = () => {
        resetButton.style.display = "none";
    };

    const changeDropdownLabel = (buttonId, dropdownId) => {
        const buttonElement = document.getElementById(buttonId);
        const dropdownElement = document.getElementById(dropdownId);
        let isReset = false;

        dropdownElement.addEventListener("click", (event) => {
            showResetButton();
            let spanElement = "";
            if (event.target.tagName === "LI") {
                if (event.target == 0) isReset = true;
                spanElement =
                    event.target.querySelector("span.dropdown-item");
            } else {
                if (event.target.parentNode.id == 0) isReset = true;
                spanElement = event.target;
            }

            if (spanElement && !isReset) {
                buttonElement.innerText = spanElement.innerText;
                buttonElement.classList.add("selected");

                switch (buttonId) {
                    case "countryDropdown":
                        GlobalDataManager.filterObject["country"] =
                            spanElement.innerText;
                        break;
                    case "industryDropdown":
                        GlobalDataManager.filterObject["2"] =
                            spanElement.innerText;
                        break;
                }
            }

            if (isReset) {
                switch (buttonId) {
                    case "countryDropdown":
                        buttonElement.innerText = "Choose a Country";
                        delete GlobalDataManager.filterObject["country"];
                        break;
                    case "industryDropdown":
                        buttonElement.innerText = "Choose an Industry";
                        delete GlobalDataManager.filterObject["2"];
                        break;
                }

                buttonElement.classList.remove("selected");
                isReset = false;
            }
        });
    };

    const handleCheckboxChange = (checkbox, key, value) => {
        if (checkbox.checked) {
            addToFilterObject(key, value);

            if (key == "city") {
                citySelected += 1;
                cityDropdownButton.classList.add("selected");
                cityDropdownButton.innerText = `${citySelected} City Selected`;
            } else if (key == "country") {
                countrySelected += 1;
                countryDropdownButton.classList.add("selected");
                countryDropdownButton.innerText = `${countrySelected} Country Selected`;
            } else if (key == "2") {
                industrySelected += 1;
                industryDropdownButton.classList.add("selected");
                industryDropdownButton.innerText = `${industrySelected} Industry Selected`;
            }

            showResetButton();
        } else {
            removeFromFilterObject(key, value);

            if (key == "city") {
                citySelected -= 1;
                if (citySelected < 1) {
                    cityDropdownButton.innerText = "Choose a City";
                    cityDropdownButton.classList.remove("selected");
                } else {
                    cityDropdownButton.innerText = `${citySelected} City Selected`;
                }
            } else if (key == "country") {
                countrySelected -= 1;
                if (countrySelected < 1) {
                    countryDropdownButton.innerText = "Choose a City";
                    countryDropdownButton.classList.remove("selected");
                } else {
                    countryDropdownButton.innerText = `${countrySelected} Country Selected`;
                }
            } else if (key == "2") {
                industrySelected -= 1;
                if (industrySelected < 1) {
                    industryDropdownButton.innerText = "Choose a City";
                    industryDropdownButton.classList.remove("selected");
                } else {
                    industryDropdownButton.innerText = `${industrySelected} Industry Selected`;
                }
            }
        }

        if (Object.keys(GlobalDataManager.filterObject).length < 1) {
            resetFilters();
        }

        updatePills();
        checkPillsContainerChildren();
    };

    const fixDropdown = () => {
        const dropdownContainers = document.querySelectorAll(".dropdown");
        dropdownContainers.forEach(function (container) {
            const dropdownValues =
                container.querySelector(".dropdown-menu");
            dropdownValues.addEventListener("click", function (event) {
                event.stopPropagation();
            });

            const labels =
                dropdownValues.querySelectorAll(".form-check-label");
            labels.forEach(function (label) {
                label.addEventListener("click", function (event) {
                    event.stopPropagation();
                });
            });
        });
    };

    const adjustDropdownButtonWidth = (buttonId, dropdownId) => {
        const dropdownWidth =
            document.getElementById(dropdownId).offsetWidth;
        document.getElementById(buttonId).style.width =
            dropdownWidth + "px";
    };

    const adjustDropdowns = () => {
        const dropdownMappings = [
            {
                buttonId: "countryDropdown",
                dropdownId: "countryDropdownValues",
            },
            {
                buttonId: "industryDropdown",
                dropdownId: "industryDropdownValues",
            },
            { buttonId: "cityDropdown", dropdownId: "cityDropdownValues" },
        ];

        dropdownMappings.forEach((mapping) => {
            document
                .getElementById(mapping.buttonId)
                .addEventListener("shown.bs.dropdown", function () {
                    adjustDropdownButtonWidth(
                        mapping.buttonId,
                        mapping.dropdownId
                    );
                });

            document
                .getElementById(mapping.buttonId)
                .addEventListener("hidden.bs.dropdown", function () {
                    resetDropdownButtonWidth(mapping.buttonId);
                });
        });
    };

    const resetDropdownButtonWidth = (buttonId) => {
        const button = document.getElementById(buttonId);
        button.style.width = "";
    };

    const generateIds = (inputString) => {
        var words = inputString.split(" ");
        var convertedString = words
            .map(function (word) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join("");
        return convertedString;
    };

    return {
        initialize,
        showResetButton,
        handleCheckboxChange,
        checkPillsContainerChildren,
        updatePills,
    };
})();

const NoJobsManager = (() => {
    let sectionNoJobs = document.getElementById("noJobs");
    let sectionJobListings = document.getElementById("jobListings");

    const showNoJobs = () => {
        sectionJobListings.style.display = "none";
        sectionNoJobs.style.display = "block";
    };

    const hideNoJobs = () => {
        sectionNoJobs.style.display = "none";
        sectionJobListings.style.display = "block";
    };

    return {
        showNoJobs,
        hideNoJobs,
    };
})();

const FilterManager = (() => {
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");

    const initialize = () => {
        searchBtn.addEventListener("click", prepareFilterParams);
    };

    const prepareFilterParams = () => {
        if (searchInput.value != "") {
            GlobalDataManager.filterObject["search_keyword"] =
                searchInput.value;
            DropdownsManager.showResetButton();
            DropdownsManager.updatePills();
            DropdownsManager.checkPillsContainerChildren();
        }
        if (Object.keys(GlobalDataManager.filterObject).length == 0) return;
        let param = "?";
        let customFields = "";
        let customFieldPram = "";
        for (key in GlobalDataManager.filterObject) {
            if (!isNaN(key)) {
                customFields += `{"field_id": ${Number(
                    key
                )},"filter_type": "equals","value": "${
                    GlobalDataManager.filterObject[key]
                }"},`;
            } else {
                param +=
                    key + "=" + GlobalDataManager.filterObject[key] + "&";
            }
        }
        if (customFields != "") {
            customFieldPram =
                `custom_field=[` +
                encodeURIComponent(
                    customFields.substring(0, customFields.length - 1)
                ) +
                `]`;
        }
        updateJobs(param + customFieldPram);
    };

    const updateJobs = async (params) => {
        cardContainer.replaceChildren();
        NoJobsManager.hideNoJobs();

        LoadManager.showSectionLoader();
        try {
            const response = await fetch(
                GlobalDataManager.solutionsApiBaseUrl +
                    "jobs/search/" +
                    GlobalDataManager.accountId +
                    params +
                    "&keys=custom_field[2],custom_field[4],custom_field[12],owner"
            );
            if (!response.ok) {
                AnimationManager.showSectionLoader();
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            if (data.count > 0) {
                cardContainer.replaceChildren();
                JobInformationManager.populateJobCards(data);
                LoadManager.hideSectionLoader();
                AnimationManager.triggerCardAnimation();
            } else {
                NoJobsManager.showNoJobs();
            }
            GlobalDataManager.jobsUpdated = true;
        } catch (error) {
            console.error("Fetch error: ", error.message);
            throw error;
        }
    };

    return {
        initialize,
        prepareFilterParams,
    };
})();

const ScrollToTopManager = (() => {
    const section = document.getElementById("filterSection");
    const scrollToTopButton = document.getElementById("scrollToTop");

    const initialize = () => {
        scrollToTopButton.addEventListener("click", scrollToTop);

        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 0.1,
        };

        const observer = new IntersectionObserver(function (
            entries,
            observer
        ) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    scrollToTopButton.style.display = "none";
                } else {
                    scrollToTopButton.style.display = "block";
                }
            });
        },
        options);

        observer.observe(section);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return {
        initialize,
    };
})();

LoadManager.show();
JobInformationManager.initialize();
AnimationManager.initialize();
UserInformationManager.initialize();
DropdownsManager.initialize();
LoadManager.hide();
FilterManager.initialize();
ScrollToTopManager.initialize();