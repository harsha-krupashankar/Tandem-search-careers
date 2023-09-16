const GlobalData = (() => {
    const solutionsApiBaseUrl = 'https://solutions-test.recruitcrm.io/';
    const accountId = 23437;
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = parseInt(urlParams.get('id'));
    const jobData = {}

    return { 
        solutionsApiBaseUrl,
        accountId,
        jobId,
        jobData
    }
})(); 


const PopupManager = (() => {
    popupLink = document.getElementById("applyBtn");
    popup = document.getElementById("popup");
    backdrop = document.getElementById("backdrop");
    submitBtn = document.getElementById("submitBtn");
    form = document.getElementById("applyForm");
    submitBtnloader = document.getElementById("submitBtnLoader");
    submitBtnlabel = document.getElementById("submitBtnLabel");
    thankyouBackBtn = document.getElementById("thankyouBackBtn");


    const initialize = () => {
        popupLink.addEventListener("click", showPopup);
        backdrop.addEventListener("click", hidePopupIfClickedOutside);
        submitBtn.addEventListener("click", handleCandidateSubmit);
        form.addEventListener("submit", (event) => {
            event.preventDefault();
        });
        thankyouBackBtn.addEventListener("click", () => {
            window.open('/index.html', '_blank');
        });
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

    const validateEmail = () => {
        const emailInput = document.getElementById("email");
        const email = emailInput.value;
        console.log(email)
        const isValid =
            /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(email);
        if (!isValid || email == "") {
            emailInput.setCustomValidity("Bitte geben Sie eine gültige E-Mail Adresse ein.");
        } else {
            emailInput.setCustomValidity("");
        }
    };

    const validateResume = () => {
        const file = document.getElementById("resume");
        // const fileInput = document.querySelector(".resume-file-input");
        // const errorLabel = document.querySelector("#file-name-span");
        // const uploadButton = document.querySelector("#uploadButton");

        if (file.value === "") {
            // errorLabel.textContent = "Das Feld Lebenslauf ist erforderlich";
            // errorLabel.className = "danger";
            return false;
        }

        resume = file.files[0];
        const fileMb = resume.size / 1024 ** 2;
        if (fileMb > 8) {
            // errorLabel.textContent = "Die Größe des Lebenslaufs sollte weniger als 8 MB betragen.";
            // errorLabel.className = "danger";
            return false;
        } else {
            // errorLabel.textContent = resume.name; // resume.name.length > 30 ? resume.name.slice(0, 15) + '...' + resume.name.slice(-8) : resume.name;
            // errorLabel.classList.remove("danger");
        }
        return true;
    };

    const handleCandidateSubmit = async (event) => {
        showThankYou();
        return;
        startBtnLoad();
        const applyForm = document.getElementById("applyForm");
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
        stopBtnLoad();
    };

    const applyToJob = async (candidateData) => {
        debugger
        let applyUrl = GlobalData.solutionsApiBaseUrl + "candidates/apply-job/";
        applyUrl += GlobalData.accountId;
        // applyUrl += "?job_slug=" + GlobalData.job.job_slug;
        applyUrl += "?job_slug=" + "16945041421820024193DgT";
        applyUrl += "&allow_duplicates=False";
        // applyUrl += "&updated_by=" + job.owner;
        applyUrl += "&updated_by=" + "24193";
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

        let candidate = new FormData();

        candidate.append("candidate_data", JSON.stringify(objTemp));
        candidate.append("candidate_resume", candidateData.resume);

        console.log(applyUrl);
        console.log(Object.fromEntries(candidate));

        const response = await fetch(applyUrl, {
            method: "POST",
            body: candidate,
        });
        
        debugger
        return response;
    };

    const prepareFormData = async (event) => {
        const jobApplicationForm = new FormData(applyForm);
        const objCandidate = Object.fromEntries(jobApplicationForm);
        const formInputs = Array.from(
            document.querySelectorAll('input[name]:not([name="resume"])')
        );

        formInputs.forEach((input) => {
            input.value = input.value.trim();
        });

        if (!validateResume()) {
            // file.scrollIntoView({ behavior: "smooth" });
            return;
        } else {
            objCandidate.resume = document.getElementById("resume").files[0];
        }

        //candidate terms check
        // if (document.getElementById("candidate-terms").checked == false) {
        //     document.querySelector(".terms-warning").classList.remove("hidden");
        //     return;
        // }

        // uiModule.startSubmitLoading();
        // document.body.style.overflow = "hidden";
        // const submitResponse = await applyToJob(objCandidate);
        
        // document.body.style.overflow = "suto";
        // if (submitResponse && submitResponse.status == 201) {
        //     // uiModule.thankYou();
        // } else if (submitResponse && submitResponse.status == 429) {
        //     // showToast("Wir bearbeiten zu viele Anfragen. Bitte versuchen Sie es nach einiger Zeit erneut.");
        // } else {
        //     // showToast("Etwas ist schief gelaufen. Bitte versuchen Sie es später noch einmal.");
        // }
    };

    const showThankYou = () => {
        let popupContent = document.getElementById('applicationContainer');
        let thankYouContent = document.getElementById('thankyouContainer');
        
        popupContent.style.display = 'none';
        thankYouContent.style.display = 'block';
    }

    return {
        initialize
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
        delay += 250;  // extra delay for this one
        animate("animate-job-owner-info");
    };

    return {
        startAnimationSequence
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
        show, hide
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

    const fetchJobInformation  = async () => {
        try {
            const response = await fetch(GlobalData.solutionsApiBaseUrl+'jobs/by-id/'+GlobalData.accountId+'?job_id='+GlobalData.jobId);
            if (!response.ok) {
                LoaderManager.hide();
                JobClosedManager.initialize();
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Fetch error: ', error.message);
            throw error; // or handle error appropriately based on your requirements
        }
    };

    const populatePage = async () => {
        GlobalData.jobData = await fetchJobInformation();
        console.log(GlobalData.jobData);
        jobName.innerText = GlobalData.jobData.name;
        popupJobname.innerText = GlobalData.jobData.name;
        countryName.innerText = GlobalData.jobData.country;
        GlobalData.jobData.custom_fields.forEach( (item) => {
            if (item.field_id == '2') {
                deptName.innerText = item.value;
            } else if (item.field_id == '4') {
                jobType.innerText = item.value;
            } else if (item.field_id == '12') {
                jobPostedDate.innerText = item.value;
            }
        })
        LoaderManager.hide();
    }

    return {
        populatePage
    };
})();

const JobClosedManager = (() => {
    header = document.getElementById('header');
    main = document.getElementById('main');
    jobClosedSection = document.getElementById('jobClosedSection');
    openJobsBtn = document.getElementById('openJobsBtn');

    const initialize = () => {
        openJobsBtn.addEventListener('click', () =>{
            window.open('/index.html', '_blank');
        });
        header.style.display = 'none';
        main.style.display = 'none';
        jobClosedSection.style.display = 'block';
    };
    
    return {
        initialize
    };
})();

// Initialize and use the structured code
PopupManager.initialize();
LoaderManager.show();
JobInformationManager.populatePage();



