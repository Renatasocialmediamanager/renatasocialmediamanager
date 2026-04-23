// This ensures the script runs only after the HTML is fully loaded
window.onload = function() {
    console.log("1. Window loaded");

    const container = document.getElementById('questions-area');
    const submitBtn = document.getElementById('submit-btn');

    // Check if we can see the data from quizData.js
    if (typeof quizData === 'undefined') {
        console.error("2. ERROR: quizData.js not found or not loaded!");
        return;
    }

    if (!container) {
        console.error("2. ERROR: Could not find 'questions-area' in HTML!");
        return;
    }

    console.log("3. Data and Container found. Rendering...");
    renderQuiz(quizData, container);

    if (submitBtn) {
        submitBtn.onclick = submitQuiz;
    }
};

function renderQuiz(data, container) {
    container.innerHTML = ""; // Prevent repeats
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
        q.style.borderLeft = correct ? "5px solid #D470A2" : "5px solid #1a1a1a";
        if (correct) score++;
    });

    const percent = Math.round((score / questions.length) * 100);
    document.getElementById('result').innerHTML = `
        <div class="score-box">
            <h4>Score: ${percent}%</h4>
            <p>${percent >= 70 ? "Strategy: Elite" : "Strategy: Needs Optimization"}</p>
        </div>`;
}