const events = [
    {
        id: 1,
        title: "CodeSprint Challenge",
        type: "competition",
        day: 1,
        time: "10:00",
        venue: "Computing Lab 1",
        seats: 40
    },

    {
        id: 2,
        title: "UI/UX Design Battle",
        type: "competition",
        day: 1,
        time: "11:30",
        venue: "Design Studio",
        seats: 30
    },

    {
        id: 3,
        title: "Web Development Bootcamp",
        type: "workshop",
        day: 1,
        time: "13:00",
        venue: "Computing Lab 2",
        seats: 25
    },

    {
        id: 4,
        title: "Cybersecurity Essentials",
        type: "workshop",
        day: 1,
        time: "15:00",
        venue: "Seminar Room A",
        seats: 35
    },

    {
        id: 5,
        title: "AI: The Next Frontier",
        type: "talk",
        day: 1,
        time: "16:00",
        venue: "Main Auditorium",
        seats: 120
    },

    {
        id: 6,
        title: "Robotics Race",
        type: "competition",
        day: 2,
        time: "09:30",
        venue: "Innovation Hall",
        seats: 20
    },

    {
        id: 7,
        title: "Cloud Computing Lab",
        type: "workshop",
        day: 2,
        time: "11:00",
        venue: "Computing Lab 1",
        seats: 25
    },

    {
        id: 8,
        title: "Careers in Technology",
        type: "talk",
        day: 2,
        time: "13:00",
        venue: "Main Auditorium",
        seats: 100
    },

    {
        id: 9,
        title: "Data Science Quiz",
        type: "competition",
        day: 2,
        time: "14:30",
        venue: "Seminar Room B",
        seats: 50
    },

    {
        id: 10,
        title: "Building Accessible Websites",
        type: "workshop",
        day: 2,
        time: "15:30",
        venue: "Computing Lab 2",
        seats: 25
    }
];

const SAVED_KEY = "techfest-saved-events";
const THEME_KEY = "techfest-theme";

function readSavedEvents() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(SAVED_KEY) || "[]"
        );
        return Array.isArray(saved) ? saved : [];
    }
    catch {
        return [];
    }
}

function updateSavedCount() {
    const count = document.getElementById("saved-count");
    if (count) {
        count.textContent = String(
            readSavedEvents().length
        );
    }
}
function setupTheme() {
    const root = document.documentElement;
    const button = document.querySelector(".theme-toggle");
    const storedTheme = localStorage.getItem(THEME_KEY);
    if (storedTheme === "light" || storedTheme === "dark") {

        root.dataset.theme = storedTheme;

    }

    if (button) {
        function updateButton() {

            const activeTheme =
                root.dataset.theme ||
                (
                    window.matchMedia(
                        "(prefers-color-scheme: dark)"
                    ).matches
                    ? "dark"
                    : "light"
                );

            button.textContent =
                activeTheme === "dark"
                ? "☀ Light"
                : "☾ Dark";

        }
        updateButton();
        button.addEventListener("click", function () {

            const currentTheme =
                root.dataset.theme ||
                (
                    window.matchMedia(
                        "(prefers-color-scheme: dark)"
                    ).matches
                    ? "dark"
                    : "light"
                );


            const nextTheme =
                currentTheme === "dark"
                ? "light"
                : "dark";


            root.dataset.theme = nextTheme;

            localStorage.setItem(THEME_KEY, nextTheme);

            updateButton();

        });

    }

}

function setupMobileNav() {

    const toggle = document.querySelector(".menu-toggle");
    const links = document.querySelector(".nav-links");

    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {

        const isOpen = links.classList.toggle("open");

        toggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    });

}

function sortEventsByTime(list) {

    return [...list].sort(function (a, b) {

        return a.day - b.day ||
            a.time.localeCompare(b.time);

    });

}

function makeElement(tag, className, text) {

    const element = document.createElement(tag);

    if (className) {

        element.className = className;

    }

    if (text !== undefined) {

        element.textContent = text;

    }

    return element;

}
function renderEvents() {

    const grid = document.getElementById("event-grid");

    if (!grid) return;


    const searchInput =
        document.getElementById("event-search");

    const typeFilter =
        document.getElementById("type-filter");

    const count =
        document.getElementById("event-count");


    function updateResults() {

        const searchTerm =
            searchInput.value.trim().toLowerCase();

        const selectedType =
            typeFilter.value;

        const selectedDay =
            document.querySelector(
                'input[name="day-filter"]:checked'
            ).value;

        const matches = sortEventsByTime(events).filter(
            function (event) {

                const matchesTitle =
                    event.title.toLowerCase().includes(searchTerm);

                const matchesType =
                    selectedType === "all" ||
                    event.type === selectedType;

                const matchesDay =
                    selectedDay === "all" ||
                    event.day === Number(selectedDay);


                return matchesTitle &&
                    matchesType &&
                    matchesDay;

            }
        );

        grid.replaceChildren();

        count.textContent =
            `${matches.length} ${
                matches.length === 1 ? "event" : "events"
            } found`;

        if (matches.length === 0) {

            grid.append(

                makeElement(
                    "p",
                    "empty-state",
                    "No events found. Try changing your search or filters."
                )

            );

            return;

        }

        matches.forEach(function (event) {

            const card =
                makeElement("article", "event-card");


            const top =
                makeElement("div", "card-top");

            const badge =
                makeElement(
                    "span",
                    `category-badge ${event.type}`,
                    event.type
                );

            const day =
                makeElement(
                    "span",
                    "event-meta",
                    `Day ${event.day}`
                );

            top.append(badge, day);

            card.append(top);

            card.append(
                makeElement("h2", "", event.title)
            );

            card.append(
                makeElement(
                    "p",
                    "event-meta",
                    `◷ ${event.time}`
                )
            );

            card.append(
                makeElement(
                    "p",
                    "event-meta",
                    `⌖ ${event.venue}`
                )
            );

            card.append(
                makeElement(
                    "p",
                    "seats",
                    `${event.seats} seats available`
                )
            );

            const saved = readSavedEvents();
            const isSaved = saved.includes(event.id);
            const saveButton = makeElement(
                "button",
                "save-button",
                isSaved
                    ? "★ Added to my schedule"
                    : "☆ Add to my schedule"
            );

            saveButton.type = "button";

            saveButton.setAttribute(
                "aria-pressed",
                String(isSaved)
            );

            saveButton.addEventListener(
                "click",
                function () {

                    const currentSaved = readSavedEvents();


                    const updated =
                        currentSaved.includes(event.id)

                        ? currentSaved.filter(
                            id => id !== event.id
                        )

                        : [...currentSaved, event.id];

                    localStorage.setItem(
                        SAVED_KEY,
                        JSON.stringify(updated)
                    );
                    updateSavedCount();

                    updateResults();

                }
            );

            card.append(saveButton);

            grid.append(card);

        });

    }

    searchInput.addEventListener(
        "input",
        updateResults
    );

    typeFilter.addEventListener(
        "change",
        updateResults
    );
    document.querySelectorAll(
        'input[name="day-filter"]'
    ).forEach(function (radio) {

        radio.addEventListener(
            "change",
            updateResults
        );

    });
    updateResults();

}

function populateEventSelect() {

    const select =
        document.getElementById("event-choice");

    if (!select) return;
    sortEventsByTime(events).forEach(function (event) {

        const option = document.createElement("option");

        option.value = String(event.id);

        option.textContent =
            `${event.title} — Day ${event.day}, ${event.time}`;

        select.append(option);

    });

}

function setupRegistration() {

    const form =
        document.getElementById("registration-form");

    if (!form) return;


    const fieldIds = [

        "full-name",
        "university-email",
        "registration-number",
        "event-choice",
        "team-size",
        "participation",
        "tshirt-size",
        "terms"

    ];


    const summary =
        document.getElementById("registration-summary");

    function showError(fieldId, message) {
        const error = document.getElementById(
            `${fieldId}-error`
        );

        if (error) {
            error.textContent = message;

        }

        const field = document.getElementById(fieldId);

        if (field) {
            field.classList.toggle(
                "input-invalid",
                Boolean(message)
            );

            if (message) {
                field.setAttribute(
                    "aria-invalid",
                    "true"
                );
            }

            else {
                field.removeAttribute("aria-invalid");

            }
        }
    }
    form.addEventListener("submit", function (event) {

        event.preventDefault();
        fieldIds.forEach(function (id) {

            showError(id, "");

        });

        const name =
            document.getElementById("full-name")
            .value.trim();

        const email =
            document.getElementById("university-email")
            .value.trim();

        const regNo =
            document.getElementById("registration-number")
            .value.trim().toUpperCase();

        const eventId =
            Number(
                document.getElementById("event-choice").value
            );

        const teamSize =
            Number(
                document.getElementById("team-size").value
            );

        const participation =
            form.querySelector(
                'input[name="participation"]:checked'
            ).value;

        const tshirt =
            document.getElementById("tshirt-size").value;

        const termsAccepted =
            document.getElementById("terms").checked;

        let valid = true;

        if (name.length < 2) {

            showError(
                "full-name",
                "Please enter your full name."
            );

            valid = false;

        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.edu\.pk$/i;

        if (!emailPattern.test(email)) {

            showError(
                "university-email",
                "Email must end with .edu.pk."
            );

            valid = false;

        }

        const regPattern =
            /^F2026\d{6}$/;


        if (!regPattern.test(regNo)) {

            showError(
                "registration-number",
                "Format must be F2026 followed by exactly 6 digits."
            );

            valid = false;

        }

        if (!events.some(item => item.id === eventId)) {

            showError(
                "event-choice",
                "Please select an event."
            );

            valid = false;

        }
        if (
            !Number.isInteger(teamSize) ||
            teamSize < 1 ||
            teamSize > 4
        ) {

            showError(
                "team-size",
                "Team size must be between 1 and 4."
            );

            valid = false;

        }

        if (
            participation === "individual" &&
            teamSize !== 1
        ) {

            showError(
                "team-size",
                "Individual participation requires team size 1."
            );

            valid = false;

        }

        if (!tshirt) {

            showError(
                "tshirt-size",
                "Please select your T-shirt size."
            );

            valid = false;

        }

        if (!termsAccepted) {

            showError(
                "terms",
                "You must accept the terms and conditions."
            );

            valid = false;

        }
        summary.replaceChildren();

        if (!valid) {
            summary.hidden = true;
            const firstInvalid =
                form.querySelector('[aria-invalid="true"]');
            if (firstInvalid) {
                firstInvalid.focus();
            }
            return;

        }
        const selectedEvent =
            events.find(item => item.id === eventId);

        summary.append(
            makeElement(
                "h2",
                "",
                "Registration Successful!"
            )
        );
        summary.append(
            makeElement(
                "p",
                "",
                `Name: ${name}`
            )
        );
        summary.append(
            makeElement(
                "p",
                "",
                `Email: ${email}`
            )
        );
        summary.append(
            makeElement(
                "p",
                "",
                `Registration Number: ${regNo}`
            )
        );
        summary.append(
            makeElement(
                "p",
                "",
                `Event: ${selectedEvent.title}`
            )
        );
        summary.append(
            makeElement(
                "p",
                "",
                `Participation: ${participation}`
            )
        );
        summary.append(
            makeElement(
                "p",
                "",
                `Team Size: ${teamSize}`
            )
        );

        summary.append(
            makeElement(
                "p",
                "",
                `T-shirt Size: ${tshirt}`
            )
        );
        summary.hidden = false;
        summary.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

        form.reset();

    });
}

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupTheme();

        setupMobileNav();

        updateSavedCount();

        renderEvents();

        populateEventSelect();

        setupRegistration();

    }
);
