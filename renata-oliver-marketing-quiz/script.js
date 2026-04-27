/* --- 1. GLOBAL THEME & FONT LOGIC (For every page) --- */
function setTheme(mode) {
    if (mode === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

function setFont(size) {
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    document.body.classList.add('font-' + size);
}

/* --- 2. COLLAPSIBLE RESUME LOGIC (For Home & Resume pages) --- */
function toggleSection(id) {
    const section = document.getElementById(id);
    if (!section) return; // Guard clause
    
    if (section.style.display === "block") {
        section.style.display = "none";
    } else {
        section.style.display = "block";
    }
}

/* --- 3. QUIZ LOGIC (Specifically for the Marketing Quiz page) --- */
window.onload = function() {
    console.log("1. Window loaded");

    const container = document.getElementById('questions-area');
    const submitBtn = document.getElementById('submit-btn');

    // Only run Quiz rendering if the quiz container actually exists on this page
    if (container) {
        if (typeof quizData === 'undefined') {
            console.error("2. ERROR: quizData.js not found or not loaded!");
            return;
        }
        console.log("3. Data and Container found. Rendering...");
        renderQuiz(quizData, container);
        
        if (submitBtn) {
            submitBtn.onclick = submitQuiz;
        }
    }
};

function renderQuiz(data, container) {
    container.innerHTML = ""; 
    const ol = document.createElement('ol');

    data.questions.forEach((q, index) => {
        const li = document.createElement('li');
        li.className = q.type + " question";
        li.innerHTML = `<span class="q-title">${q.question}</span>`;
        
        const name = `q${index}`;

        if (q.type === 'single-answer') {
            q.options.forEach(opt => {
                const isCorrect = (opt === q.answer);
                li.innerHTML += `<label><input type="radio" name="${name}" data-correct="${isCorrect}"> ${opt}</label>`;
            });
        } else if (q.type === 'multiple-answer') {
            q.options.forEach(opt => {
                const isCorrect = q.answers.includes(opt);
                li.innerHTML += `<label><input type="checkbox" name="${name}" data-correct="${isCorrect}"> ${opt}</label>`;
            });
        } else if (q.type === 'free-form') {
            li.innerHTML += `<input type="text" name="${name}" data-correct-answers="${q.answers.join(',')}">`;
        }
        ol.appendChild(li);
    });
    container.appendChild(ol);
    console.log("4. Rendering complete.");
}

function submitQuiz() {
    const questions = document.querySelectorAll('.question');
    let score = 0;

    questions.forEach(q => {
        let correct = false;
        if (q.classList.contains('single-answer')) {
            const sel = q.querySelector('input:checked');
            correct = sel && sel.getAttribute('data-correct') === 'true';
        } else if (q.classList.contains('multiple-answer')) {
            const ins = q.querySelectorAll('input');
            correct = Array.from(ins).every(i => i.checked === (i.getAttribute('data-correct') === 'true'));
        } else if (q.classList.contains('free-form')) {
            const inputField = q.querySelector('input');
            const val = inputField.value.trim().toLowerCase();
            const ans = inputField.getAttribute('data-correct-answers').toLowerCase().split(',');
            correct = ans.includes(val);
        }
        // Updated to use your signature brand pink
        q.style.borderLeft = correct ? "5px solid #D470A2" : "5px solid #1a1a1a";
        if (correct) score++;
    });

    const percent = Math.round((score / questions.length) * 100);
    const resultArea = document.getElementById('result');
    if (resultArea) {
        resultArea.innerHTML = `
            <div class="score-box">
                <h4>Score: ${percent}%</h4>
                <p>${percent >= 70 ? "Strategy: Elite" : "Strategy: Needs Optimization"}</p>
            </div>`;
    }
}