
async function analyzeResume() {

    const fileInput = document.getElementById("resumeFile");
    const result = document.getElementById("result");

    const skillsResult = document.getElementById("skillsResult");
    const strengthResult = document.getElementById("strengthResult");
    const gapResult = document.getElementById("gapResult");
    const roadmapResult = document.getElementById("roadmapResult");
    const recommendationResult = document.getElementById("jobRecommendation");

    if (fileInput.files.length === 0) {
        result.textContent = "Please upload your resume first!";
        return;
    }

    const file = fileInput.files[0];

    if (file.type !== "application/pdf") {
        result.textContent = "Please upload a PDF file.";
        return;
    }

    result.textContent = "Reading your resume... Please wait.";

    try {

        const pdfData = await file.arrayBuffer();

        const pdf = await pdfjsLib.getDocument({
            data: pdfData
        }).promise;

        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {

            const page = await pdf.getPage(i);
            const content = await page.getTextContent();

            extractedText += content.items
                .map(item => item.str)
                .join(" ") + "\n";
        }

        document.getElementById("resumeText").textContent =
            extractedText;

        result.textContent =
            "Resume text extracted successfully! Pages: " + pdf.numPages;

        // SKILLS DETECTION

        const skills = [
            "Python", "Java", "C", "C++",
            "HTML", "CSS", "JavaScript",
            "SQL", "Machine Learning",
            "Deep Learning", "Data Analytics",
            "React", "Node.js", "Excel",
            "Communication", "Problem Solving"
        ];

        const foundSkills = skills.filter(skill =>
            extractedText.toLowerCase().includes(skill.toLowerCase())
        );

        skillsResult.innerHTML = "<h3>Skills Found in Your Resume</h3>";

        if (foundSkills.length > 0) {

            skillsResult.innerHTML += foundSkills
                .map(skill => `<span class="skill-tag">${skill}</span>`)
                .join(" ");

        } else {

            skillsResult.innerHTML = "<p>No skills detected.</p>";
        }

        // RESUME STRENGTH SCORE

        const skillScore = Math.round(
            (foundSkills.length / skills.length) * 100
        );

        strengthResult.innerHTML = `
            <div class="strength-card">
                <h3>Resume Strength Score</h3>
                <h2>${skillScore}%</h2>
                <p>Detected ${foundSkills.length} out of ${skills.length} skills.</p>
            </div>
        `;

        // CLEAR OLD RESULTS

        gapResult.innerHTML = "";
        roadmapResult.innerHTML = "";
        recommendationResult.innerHTML = "";

        console.log("Resume analysis completed!");

    } catch (error) {

        console.error(error);
        result.textContent = "Error reading PDF. Please try again.";
    }
}


// SHOW SELECTED FILE NAME

function showFileName() {

    const fileInput = document.getElementById("resumeFile");
    const fileName = document.getElementById("fileName");

    if (fileInput.files.length > 0) {

        fileName.textContent =
            "Selected: " + fileInput.files[0].name;

    } else {

        fileName.textContent = "No file selected";
    }
}


// SKILL GAP + LEARNING ROADMAP + JOB RECOMMENDATION

function checkSkillGap() {

    const jobInput = document.getElementById("jobSkills").value;

    const gapResult = document.getElementById("gapResult");
    const roadmapResult = document.getElementById("roadmapResult");
    const recommendationResult = document.getElementById("jobRecommendation");

    const resumeText = document.getElementById("resumeText")
        .textContent.toLowerCase();

    if (resumeText.trim() === "") {

        gapResult.innerHTML =
            "<p style='color:red;'>Please analyze your resume first!</p>";

        roadmapResult.innerHTML = "";
        recommendationResult.innerHTML = "";

        return;
    }

    if (jobInput.trim() === "") {

        gapResult.innerHTML =
            "<p style='color:red;'>Please enter required job skills!</p>";

        roadmapResult.innerHTML = "";
        recommendationResult.innerHTML = "";

        return;
    }

    const requiredSkills = jobInput
        .split(",")
        .map(skill => skill.trim().toLowerCase())
        .filter(skill => skill !== "");

    if (requiredSkills.length === 0) {

        gapResult.innerHTML = "<p>Please enter valid skills.</p>";

        roadmapResult.innerHTML = "";
        recommendationResult.innerHTML = "";

        return;
    }

    // MATCHING AND MISSING SKILLS

    const matchedSkills = requiredSkills.filter(skill =>
        resumeText.includes(skill)
    );

    const missingSkills = requiredSkills.filter(skill =>
        !resumeText.includes(skill)
    );

    const percentage = Math.round(
        (matchedSkills.length / requiredSkills.length) * 100
    );

    gapResult.innerHTML = `
        <h3>Job Compatibility: ${percentage}%</h3>

        <div class="progress-container">
            <div class="progress-bar" style="width:${percentage}%">
                ${percentage}%
            </div>
        </div>

        <p>✅ Matching Skills: ${matchedSkills.join(", ") || "None"}</p>

        <p>❌ Missing Skills: ${missingSkills.join(", ") || "None"}</p>
    `;


    // PERSONALIZED LEARNING ROADMAP

    if (missingSkills.length > 0) {

        const learningResources = {

            python: {
                beginner: "Python tutorial for beginners",
                intermediate: "Intermediate Python projects",
                advanced: "Advanced Python programming"
            },

            java: {
                beginner: "Java tutorial for beginners",
                intermediate: "Intermediate Java projects",
                advanced: "Advanced Java programming"
            },

            sql: {
                beginner: "SQL tutorial for beginners",
                intermediate: "Intermediate SQL queries",
                advanced: "Advanced SQL projects"
            },

            react: {
                beginner: "React tutorial for beginners",
                intermediate: "Intermediate React projects",
                advanced: "Advanced React projects"
            },

            html: {
                beginner: "HTML tutorial for beginners",
                intermediate: "Advanced HTML",
                advanced: "HTML projects"
            },

            css: {
                beginner: "CSS tutorial for beginners",
                intermediate: "CSS Flexbox and Grid",
                advanced: "Advanced CSS projects"
            },

            javascript: {
                beginner: "JavaScript tutorial for beginners",
                intermediate: "Intermediate JavaScript projects",
                advanced: "Advanced JavaScript"
            }
        };

        let roadmapHTML = `
            <h2>📚 Personalized Learning Roadmap</h2>
            <p>Follow these learning levels to improve your job readiness.</p>
        `;

        missingSkills.forEach(skill => {

            const resources = learningResources[skill] || {

                beginner: skill + " tutorial for beginners",

                intermediate: "Intermediate " + skill + " tutorial",

                advanced: "Advanced " + skill + " projects"
            };

            roadmapHTML += `
                <div class="roadmap-card">

                    <h3>🎯 ${skill.toUpperCase()}</h3>

                    <div class="roadmap-level">
                        <p>🟢 Beginner</p>

                        <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(resources.beginner)}"
                           target="_blank" rel="noopener noreferrer">
                           Start Learning →
                        </a>
                    </div>

                    <div class="roadmap-level">
                        <p>🟡 Intermediate</p>

                        <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(resources.intermediate)}"
                           target="_blank" rel="noopener noreferrer">
                           Continue Learning →
                        </a>
                    </div>

                    <div class="roadmap-level">
                        <p>🔵 Advanced</p>

                        <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(resources.advanced)}"
                           target="_blank" rel="noopener noreferrer">
                           Master This Skill →
                        </a>
                    </div>

                </div>
            `;
        });

        roadmapResult.innerHTML = roadmapHTML;

    } else {

        roadmapResult.innerHTML = `
            <h2>🎉 Excellent!</h2>
            <p>You have all the required job skills in your resume.</p>
        `;
    }


    // JOB ROLE RECOMMENDATION

    const jobRoles = [

        {
            role: "Frontend Developer",
            skills: ["html", "css", "javascript", "react"]
        },

        {
            role: "Python Developer",
            skills: ["python", "sql", "machine learning"]
        },

        {
            role: "Data Analyst",
            skills: ["python", "sql", "excel", "data analytics"]
        },

        {
            role: "Web Developer",
            skills: ["html", "css", "javascript", "php"]
        },

        {
            role: "Machine Learning Engineer",
            skills: ["python", "machine learning", "deep learning"]
        },

        {
            role: "Software Developer",
            skills: ["java", "python", "c++", "sql"]
        }
    ];

    const matchedRoles = jobRoles.map(job => {

        const matched = job.skills.filter(skill =>
            resumeText.includes(skill)
        );

        const score = Math.round(
            (matched.length / job.skills.length) * 100
        );

        return {

            role: job.role,
            score: score,
            matchedSkills: matched
        };

    })
    .filter(job => job.score > 0)
    .sort((a, b) => b.score - a.score);


    if (matchedRoles.length > 0) {

        recommendationResult.innerHTML = `

            <h2>🎯 Recommended Job Roles</h2>

            <p>Based on the skills detected in your resume.</p>

            ${matchedRoles.slice(0, 3).map(job => `

                <div class="job-role-card">

                    <h3>💼 ${job.role}</h3>

                    <p>Skill Match: <strong>${job.score}%</strong></p>

                    <p>Matching Skills: ${job.matchedSkills.join(", ")}</p>

                </div>

            `).join("")}

        `;

    } else {

        recommendationResult.innerHTML = `

            <h2>🎯 Job Role Recommendations</h2>

            <p>Keep developing your technical skills to discover suitable roles!</p>

        `;
    }

}


// DARK MODE TOGGLE

function toggleTheme() {

    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem("theme", isDark ? "dark" : "light");

    updateThemeButton();
}


// UPDATE THEME BUTTON

function updateThemeButton() {

    const button = document.getElementById("themeToggle");

    if (!button) return;

    if (document.body.classList.contains("dark-mode")) {

        button.innerHTML = "☀️ Light Mode";

    } else {

        button.innerHTML = "🌙 Dark Mode";
    }
}


// LOAD SAVED THEME

function loadTheme() {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

    } else {

        document.body.classList.remove("dark-mode");
    }

    updateThemeButton();
}


// START JOURNEY BUTTON

function startJourney() {

    window.location.href = "analyzer.html";
}


// RUN WHEN PAGE LOADS

document.addEventListener("DOMContentLoaded", loadTheme);
