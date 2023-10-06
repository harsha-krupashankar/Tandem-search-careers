const GlobalDataManager = (() => {
    const solutionsApiBaseUrl = "https://solutions-test.recruitcrm.io/";
    const accountId = "8304af2b-ffa0-4cd8-b211-058aa611e198";
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = parseInt(urlParams.get("id"));
    const jobData = {};

    return {
        solutionsApiBaseUrl,
        accountId,
        jobId,
        jobData,
    };
})();

const PopupManager = (() => {
    popupLink = document.getElementById("applyBtn");
    popup = document.getElementById("popup");
    backdrop = document.getElementById("backdrop");
    form = document.getElementById("applyForm");
    submitBtnloader = document.getElementById("submitBtnLoader");
    submitBtnlabel = document.getElementById("submitBtnLabel");
    thankyouBackBtn = document.getElementById("thankyouBackBtn");
    popupBackBtn = document.getElementById("popupBack");
    popupCloseBtn = document.getElementById("popupClose");
    otherContent = document.getElementById("otherContent");
    popupContent = document.getElementById("applicationContainer");
    thankYouContent = document.getElementById("thankyouContainer");
    candidateTermsLink = document.getElementById("candidateTermsLink");
    eeoLink = document.getElementById("eeoLink");


    const initialize = () => {
        popupLink.addEventListener("click", showPopup);
        backdrop.addEventListener("click", hidePopupIfClickedOutside);
        popupCloseBtn.addEventListener("click", hidePopup);
        
        form.addEventListener("submit", (event) => {
            event.preventDefault();
        });
        thankyouBackBtn.addEventListener("click", () => {
            window.open("/index.html", "_blank");
        });
        popupBackBtn.addEventListener("click", () => {
            otherContent.style.display = "none";
            popupContent.style.display = "block";

        });
        candidateTermsLink.addEventListener("click", showCandidateTerms);
        eeoLink.addEventListener("click", showEeo);
    };

    const showEeo = () => {
        let otherTextDiv = document.getElementById("otherText");
        otherTextDiv.innerHTML = `
            <h6 class="popup-heading" id="contentName">
                Equal Employment Opportunity Policy
            </h6>
            <br>
            <p>Our company and our clients do not discriminate in employment on the basis of race, color, religion, sex (including pregnancy and gender identity), national origin, political affiliation, sexual orientation, marital status, disability, genetic information, age, membership in an employee organization, retaliation, parental status, military service, or other non-merit factors.
            </p>
            <br>
        `;
        popupContent.style.display = "none";
        otherContent.style.display = "block";
    };

    const showCandidateTerms = () => {
        let otherTextDiv = document.getElementById("otherText");
        otherTextDiv.innerHTML = `
            <h6 class="popup-heading" id="contentName">
                Candidate terms
            </h6>
            <br>
            <p>Your Recruitment Partner Associate will be storing your data in Recruit CRM to manage your information and send your profile to companies to present you for potential job Opportunities.
            </p>
            <br>
            <p>Recruit CRM is a software system that helps recruitment firms manage their relationship with their clients. You can view Recruit CRMs privacy policy or GDPR commitment on our website.  Recruit CRM may store your data in a Data Centre inside or outside Europe.</p>
            <br>
            <p>You can ask your recruiter at any point to delete your data or simply ask them for an “Update resume link” which you can use to update your profile information/resume or simply delete your data from their system.</p>
            <br>
        `;
        popupContent.style.display = "none";
        otherContent.style.display = "block";
    };

    const showPopup = () => {
        popup.style.display = "block";
        backdrop.style.display = "block";
    };

    const hidePopupIfClickedOutside = (event) => {
        if (!popup.contains(event.target) && event.target !== popupLink) {
            hidePopup();
        }
    };

    const startBtnLoad = () => {
        submitBtnlabel.style.display = "none";
        submitBtnloader.style.display = "inline-block";
    };

    const stopBtnLoad = () => {
        submitBtnlabel.style.display = "block";
        submitBtnloader.style.display = "none";
    };

    const hidePopup = () => {
        popup.style.display = "none";
        backdrop.style.display = "none";
    };

    

    

    

    



    const showThankYou = () => {
        popupContent.style.display = "none";
        thankYouContent.style.display = "block";
    };

    return {
        initialize,
        startBtnLoad,
        stopBtnLoad,
        showThankYou
    };
})();

const AnimationManager = (() => {
    delay = 250;

    const animate = (elementClass) => {
        setTimeout(() => {
            document.body.classList.add(elementClass);
        }, delay);
        delay += 250;
    };

    const startAnimationSequence = () => {
        animate("animate-header");
        delay += 500;
        animate("animate-job-name");
        animate("animate-department-name");
        animate("animate-other-info");
        animate("animate-button-apply");
        animate("animate-button-back");
        animate("animate-job-description");
        delay += 250; 
        animate("animate-job-owner-info");
    };

    return {
        startAnimationSequence,
    };
})();

const LoaderManager = (() => {
    const show = () => {
        document.getElementById("loaderContainer").style.display = "flex";
    };

    const hide = () => {
        document.getElementById("loaderContainer").style.display = "none";
        AnimationManager.startAnimationSequence();
    };

    return {
        show,
        hide,
    };
})();

const CandidateApplyManager = (() => {
    submitBtn = document.getElementById("submitBtn");
    applyForm = document.getElementById("applyForm");
    file = document.getElementById("resume");
    emailInput = document.getElementById("email");
    let inputTimeout;

    const initialize = () => {
        submitBtn.addEventListener("click", handleCandidateSubmit);
        file.onchange = function () {
            let errorLabel = document.getElementById("resumeErrorLabel");
            resume = file.files[0];
            const fileMb = resume.size / 1024 ** 2;
            
            if (fileMb > 16) {
                errorLabel.textContent = "Please upload a resume that is less than 16 MB";
                file.value = "";
                file.classList.add('is-invalid');
                return false;
            } 
            return true;
        }
        emailInput.addEventListener("input", checkEmailInput);

        const textInputs = document.querySelectorAll('input[type="text"]');

        textInputs.forEach(input => {
            input.addEventListener('blur', function() {
                this.value = this.value.trim();
            });
        });
    };

    const checkEmailInput = () => {
        clearTimeout(inputTimeout);

        inputTimeout = setTimeout(() => {
            validateEmail();
        }, 1000);
    };

    const handleCandidateSubmit = async (event) => {
        PopupManager.startBtnLoad();
        let requiredFields = document.getElementsByClassName("validate-me");
        validateEmail();

        if (!applyForm.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            await prepareFormData(event);
        }
        for (let field of requiredFields) {
            field.classList.add("was-validated");
        }
        PopupManager.stopBtnLoad();
    };

    const validateEmail = () => {
        const email = emailInput.value;
        const isValid =
            /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(email);
        if (!isValid || email == "") {
            emailInput.classList.add("is-invalid");
        } else {
            emailInput.classList.remove("is-invalid");
            emailInput.classList.add("is-valid");
        }
    };
    
    

    const prepareFormData = async (event) => {
        const jobApplicationForm = new FormData(applyForm);
        const objCandidate = Object.fromEntries(jobApplicationForm);
        const formInputs = Array.from(
            document.querySelectorAll('input[name]:not([name="resume"])')
        );

        if (document.getElementById("emailConsent").checked) {
            objCandidate.emailConsent = "Yes";
        }
        
        objCandidate.resume = document.getElementById("resume").files[0];

        const submitResponse = await applyToJob(objCandidate);

        if (submitResponse.status == 201) {
            PopupManager.showThankYou();
            NotificationManager.showNotification("Submitted successfully");
        } else {
            NotificationManager.showNotification("Something went wrong! Please trey again later.", 5000);
        }

    };

    const applyToJob = async (candidateData) => {
        let applyUrl =
            GlobalDataManager.solutionsApiBaseUrl + "candidates/apply-job/";
            applyUrl += GlobalDataManager.accountId;
        // applyUrl += '053116fb-7060-4941-9557-9e3dff56fa85';
        
        applyUrl += "?job_slug=" + GlobalDataManager.jobData.job_slug;
        // applyUrl += "?job_slug=" + "16945041421820024193DgT";
        applyUrl += "&allow_duplicates=False";
        applyUrl += "&updated_by=" + GlobalDataManager.jobData.owner;
        // applyUrl += "&updated_by=" + "24193";
        const objTemp = {
            first_name: candidateData.firstName,
            last_name: candidateData.lastName,
            email: candidateData.email,
            contact_number: candidateData.phone,
            country: candidateData.country,
            current_organization: candidateData.currentOrganization,
            position: candidateData.currentTitle,
            source: "website",
        };

        if ("emailConsent" in  candidateData) {
            objTemp["custom_fields[0][field_id]"] = 35;
            objTemp["custom_fields[0][value]"] = candidateData.emailConsent;
        }

        let candidate = new FormData();

        candidate.append("candidate_data", JSON.stringify(objTemp));
        candidate.append("candidate_resume", candidateData.resume);


        const response = await fetch(applyUrl, {
            method: "POST",
            body: candidate,
        });
        return response;
    };

    return {
        initialize
    };
})();

const JobInformationManager = (() => {
    jobName = document.getElementById("jobName");
    deptName = document.getElementById("deptName");
    countryName = document.getElementById("countryName");
    jobType = document.getElementById("jobType");
    jobPostedDate = document.getElementById("jobPostedDate");
    jobDescription = document.getElementById("jobDescription");
    popupJobname = document.getElementById("popupJobname");
    backBtn = document.getElementById("backBtn");

    const initialize = () => {
        backBtn.addEventListener('click', () => {
            window.open('/index.html', '_blank');
        });
        populatePage();
    };

    const fetchJobInformation = async () => {
        try {
            const response = await fetch(
                GlobalDataManager.solutionsApiBaseUrl +
                "jobs/by-id/" +
                GlobalDataManager.accountId +
                "?job_id=" +
                GlobalDataManager.jobId
            );
            if (!response.ok) {
                LoaderManager.hide();
                JobClosedManager.initialize();
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Fetch error: ", error.message);
            throw error; 
        }
    };

    const populatePage = async () => {
        GlobalDataManager.jobData = await fetchJobInformation();
        jobName.innerText = GlobalDataManager.jobData.name;
        popupJobname.innerText = GlobalDataManager.jobData.name;
        // jobDescription.innerHTML = GlobalDataManager.jobData.job_description_text ? GlobalDataManager.jobData.job_description_text: "";
        let country = GlobalDataManager.jobData.country;
        let city = GlobalDataManager.jobData.city;
        let emptyPlaceholder = "Not Available";
        if ((country && country != "None") && (city && city != "None")) {
            countryName.innerText = `${city} - ${country}`;
        } else if (country && country != "None") {
            countryName.innerText = country;
        } else if (city && city != "None") {
            countryName.innerText = city;
        } else {
            countryName.innerText = emptyPlaceholder;
        }
        GlobalDataManager.jobData.custom_fields.forEach((item) => {
            if (item.field_id == "2") {
                deptName.innerText = (item.value && item.value != "None") ? item.value: emptyPlaceholder;
            } else if (item.field_id == "4") {
                jobType.innerText = (item.value && item.value != "None") ? item.value: emptyPlaceholder;
            } else if (item.field_id == "12") {
                jobPostedDate.innerText = (item.value && item.value != "None") ? item.value: emptyPlaceholder;
            }
        });
        LoaderManager.hide();
    };

    return {
        initialize,
    };
})();

const JobClosedManager = (() => {
    header = document.getElementById("header");
    main = document.getElementById("main");
    jobClosedSection = document.getElementById("jobClosedSection");
    openJobsBtn = document.getElementById("openJobsBtn");

    const initialize = () => {
        openJobsBtn.addEventListener("click", () => {
            window.open("/index.html", "_blank");
        });
        header.style.display = "none";
        main.style.display = "none";
        jobClosedSection.style.display = "block";
    };

    return {
        initialize,
    };
})();

const UserInformationManager = (() => {
    let ownerImg = document.getElementById("ownerImg");
    let ownerName = document.getElementById("ownerName");
    let ownerEmail = document.getElementById("ownerEmail");

    const initialize = async () => {
        const userInfo = await fetchUserInfo();
        processUserInfo(userInfo);
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

    const processUserInfo = (data) => {
        user = data.find(
            (user) => user.id === parseInt(GlobalDataManager.jobData.owner)
        );
        if (user.avatar) ownerImg.src = user.avatar;
        if (user.first_name && user.last_name)
            ownerName.innerText = user.first_name + " " + user.last_name;
        if (user.email) ownerEmail.href = "mailto:" + user.email;
    };

    return {
        initialize,
    };
})();

const NotificationManager = (() => {
    const showNotification = (message, duration = 3000) => {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            ${message}
            <span class="close-btn">&times;</span>
        `;
    
        notification.querySelector('.close-btn').addEventListener('click', () => {
            closeNotification(notification);
        });
    
        const manager = document.querySelector('.notification-manager');
        manager.appendChild(notification);
    
        setTimeout(() => {
            closeNotification(notification);
        }, duration);
    };
    
    const closeNotification = (notification) => {
        notification.classList.add('slide-up');
    
        notification.addEventListener('animationend', () => {
            notification.remove();
        });
    };
    
    return {
        showNotification
    };
    
})();


PopupManager.initialize();
LoaderManager.show();
JobInformationManager.initialize();
UserInformationManager.initialize();
CandidateApplyManager.initialize();
