// === Section Display Logic ===
function showSection(sectionId) {
    const sections = ['cv', 'quiz', 'calc'];

    sections.forEach(id => {
        const section = document.getElementById(id);
        if (sectionId === id) {
            section.classList.remove('hidden');
            section.classList.add('animate-fade-in');
        } else {
            section.classList.add('hidden');
            section.classList.remove('animate-fade-in');
        }
    });

    // Load quiz on access
    if (sectionId === 'quiz') {
        loadQuestion();
    }
}

// === Animation ===
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease-in-out;
        }
    `;
    document.head.appendChild(style);
});

// === Calculator ===
function appendCalc(char) {
    const input = document.getElementById('calcInput');
    input.value += char;
}

function clearCalc() {
    const input = document.getElementById('calcInput');
    input.value = '';
}

function calculateResult() {
    const input = document.getElementById('calcInput');
    try {
        input.value = eval(input.value);
    } catch {
        input.value = 'Erreur';
    }
}

// === Interactive Quiz ===
const questions = [
    {
        question: "Who is the best League player?",
        answers: ["Me", "Faker", "Polak", "You"],
        correctIndex: 0
    },
    {
        question: "What is the best role in League?",
        answers: ["Top", "Jungle", "Mid", "Support"],
        correctIndex: 0
    },
    {
        question: "Which champion is the best?",
        answers: ["Zed", "Ahri", "Lee Sin", "Jinx"],
        correctIndex: 0
    },
];

let currentQuestionIndex = 0;
let selectedAnswers = {};
const questionEl = document.getElementById("quiz-question");
const answersEl = document.getElementById("quiz-answers");
const prevBtn = document.getElementById("quiz-prev");
const nextBtn = document.getElementById("quiz-next");
const resultEl = document.getElementById("quizResult");

function loadQuestion() {
    const q = questions[currentQuestionIndex];
    questionEl.textContent = `Question ${currentQuestionIndex + 1}: ${q.question}`;
    answersEl.innerHTML = "";

    q.answers.forEach((answer, index) => {
        const btn = document.createElement("button");
        btn.textContent = answer;
        btn.classList.add("btn", "m-1", "px-4", "py-2", "rounded", "border");

        // If already answered
        if (selectedAnswers[currentQuestionIndex] !== undefined) {
            btn.disabled = true;

            const selectedIndex = selectedAnswers[currentQuestionIndex];
            if (index === selectedIndex) {
                btn.classList.add(index === q.correctIndex ? "bg-green-500" : "bg-red-500");
            }
            if (index === q.correctIndex && selectedIndex !== q.correctIndex) {
                btn.classList.add("bg-green-300");
            }
        } else {
            btn.addEventListener("click", () => selectAnswer(index));
        }

        answersEl.appendChild(btn);
    });

    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = selectedAnswers[currentQuestionIndex] === undefined;
    resultEl.innerHTML = ""; // Clear result between steps
}

function selectAnswer(index) {
    selectedAnswers[currentQuestionIndex] = index;
    loadQuestion(); // Reload with locked state
}

nextBtn.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        showScore();
    }
});

prevBtn.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
});

function showScore() {
    let score = 0;
    questions.forEach((q, i) => {
        if (selectedAnswers[i] === q.correctIndex) {
            score++;
        }
    });

    resultEl.innerHTML = `<p class="text-lg font-bold text-green-500">Your score: ${score} / ${questions.length}</p>`;
}
