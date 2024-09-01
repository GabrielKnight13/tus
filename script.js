// Placeholder for the questions, options, correct answers, and explanations
let questions = [];
let options = [];
let correctAnswers = [];
let explanations = [];
let selectedOptionIndex = null;  // To store the index of the selected option
let currentQuestionIndex = 0; // To keep track of the current question index

// Load the questions, options, correct answers, and explanations when the page loads
window.onload = function() {
    console.log("Page loaded");
    loadAllData();
};

// Function to load questions, options, correct answers, and explanations
function loadAllData() {
    console.log("Loading all data");
    
    // Fetch questions
    fetch('soru.txt')
        .then(response => {
            console.log("Fetched soru.txt", response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            questions = data.trim().split('\n');
            console.log('Questions loaded:', questions);  // Debugging log
            return fetch('secenekler.txt');  // Fetch options after questions are loaded
        })
        .then(response => {
            console.log("Fetched secenekler.txt", response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            options = data.trim().split('\n').map(line => {
                const match = line.match(/\[(.*)\]/);
                return match ? match[1].split("', '").map(option => option.replace(/^'|'$/g, '')) : [];
            });
            console.log('Options loaded:', options);  // Debugging log
            return fetch('cevap.txt');  // Fetch correct answers
        })
        .then(response => {
            console.log("Fetched cevap.txt", response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            correctAnswers = data.trim().split('\n').map(line => {
                const match = line.match(/#\d+\s(\d+)/);
                return match ? parseInt(match[1]) : null;
            });
            console.log('Correct answers loaded:', correctAnswers);  // Debugging log
            return fetch('aciklama.txt');  // Fetch explanations
        })
        .then(response => {
            console.log("Fetched aciklama.txt", response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            explanations = data.trim().split('\n').map(line => {
                const match = line.match(/#\d+\s(.+)/);
                return match ? match[1] : '';
            });
            console.log('Explanations loaded:', explanations);  // Debugging log
            displayQuestion(0);  // Start with the first question
        })
        .catch(error => console.error('Error loading data:', error));
}

// Function to display a question
function displayQuestion(index) {
    console.log(`Displaying question ${index}`);
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options');
    const explanationContainer = document.getElementById('explanation');
    optionsContainer.innerHTML = ''; // Clear previous options
    explanationContainer.innerHTML = ''; // Clear previous explanation
    selectedOptionIndex = null;  // Reset selected option for new question

    if (index < questions.length) {
        questionElement.textContent = questions[index];
        displayOptions(index);  // Display options corresponding to the question
        addExplanationButton(); // Add explanation button

        // Enable or disable the Previous button based on question index
        document.getElementById('prev-button').disabled = index === 0;
        document.getElementById('next-button').disabled = index === questions.length - 1;
    } else {
        questionElement.textContent = "You've completed the quiz!";
        document.getElementById('next-button').style.display = 'none'; // Hide the Next button
        document.getElementById('prev-button').style.display = 'none'; // Hide the Previous button
    }
}

// Function to display options for the current question
function displayOptions(index) {
    console.log(`Displaying options for question ${index}`);
    const optionsContainer = document.getElementById('options');

    const questionOptions = options[index];
    questionOptions.forEach((option, i) => {
        const optionButton = document.createElement('button');
        optionButton.className = 'option-button';
        optionButton.textContent = `Opsiyon ${i + 1}: ${option}`;
        optionButton.onclick = () => selectOption(optionButton, i);
        optionsContainer.appendChild(optionButton);
    });
}

// Function to handle option selection
function selectOption(button, selectedIndex) {
    console.log(`Option ${selectedIndex + 1} selected`);
    
    // Deselect previous option
    const optionsButtons = document.querySelectorAll('.option-button');
    optionsButtons.forEach(btn => btn.classList.remove('selected'));

    // Select new option
    button.classList.add('selected');
    selectedOptionIndex = selectedIndex;  // Store selected index

    // Check if the selected option is correct
    checkAnswer();
}

// Function to check the answer and provide feedback
function checkAnswer() {
    const correctAnswer = correctAnswers[currentQuestionIndex];
    const feedbackElement = document.createElement('div');
    feedbackElement.className = 'feedback';

    if (selectedOptionIndex === correctAnswer) {
        feedbackElement.textContent = 'Doğru! Bravo!';
        feedbackElement.style.color = 'green';
    } else {
        feedbackElement.textContent = `Yanlış! Doğru Cevap Opsiyon: ${correctAnswer + 1}.`;
        feedbackElement.style.color = 'red';
    }

    document.getElementById('options').appendChild(feedbackElement);

    // Disable all buttons after selection
    const optionsButtons = document.querySelectorAll('.option-button');
    optionsButtons.forEach(btn => btn.disabled = true);
}

// Function to add explanation button
function addExplanationButton() {
    const explanationContainer = document.getElementById('explanation');
    const explanationButton = document.createElement('button');
    explanationButton.textContent = 'Açıklama';
    explanationButton.className = 'explanation-button';
    explanationButton.onclick = showExplanation;
    explanationContainer.appendChild(explanationButton);
}

// Function to show explanation
function showExplanation() {
    const explanationText = explanations[currentQuestionIndex];
    const explanationElement = document.createElement('div');
    explanationElement.className = 'explanation-text';
    explanationElement.textContent = explanationText;
    const explanationContainer = document.getElementById('explanation');
    explanationContainer.innerHTML = ''; // Clear previous explanation button
    explanationContainer.appendChild(explanationElement);
}

// Function to load the next question
function loadNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
    }
}

// Function to load the previous question
function loadPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion(currentQuestionIndex);
    }
}
