// Initialize SpeechRecognition and SpeechSynthesis
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
const synth = window.speechSynthesis;

const startBtn = document.getElementById('start-btn');
const chatBox = document.getElementById('chat-box');

let currentQuestion = 0;
const questions = [
    "What is your name?",
    "How old are you?",
    "What is your favorite color?",
    "Where do you live?"
];

// Start the chat when the button is clicked
startBtn.addEventListener('click', startChat);

function startChat() {
    currentQuestion = 0; // Reset question index
    chatBox.innerHTML = ''; // Clear chat box
    askQuestion(questions[currentQuestion]);
}

// Function to ask a question
function askQuestion(question) {
    appendMessage("Chatbot: " + question);
    speak(question);
}

// Event listener for when the user provides an answer
recognition.onresult = function(event) {
    const userAnswer = event.results[0][0].transcript;
    appendMessage("You: " + userAnswer);

    // Move to the next question
    currentQuestion++;
    
    // Check if there are more questions
    if (currentQuestion < questions.length) {
        // Start listening for the next question immediately
        askQuestion(questions[currentQuestion]);
        recognition.start(); // Restart recognition
    } else {
        appendMessage("Chatbot: Thank you for answering!");
        speak("Thank you for answering!");
    }
};

// Function to handle recognition errors
recognition.onerror = function(event) {
    appendMessage("Chatbot: Sorry, I didn't catch that. Can you repeat?");
    speak("Sorry, I didn't catch that.");
    recognition.stop(); // Stop recognition to avoid InvalidStateError
    recognition.start(); // Restart listening
};

// Start listening for answers when the recognition starts
recognition.onstart = function() {
    console.log("Listening for an answer...");
};

// Start listening for the user's answer when the recognition ends
recognition.onend = function() {
    // Automatically restart recognition without waiting for a response
    if (currentQuestion < questions.length) {
        recognition.start();
    }
};

// Function to append a message to the chat box
function appendMessage(message) {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to speak a message
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
        recognition.start(); // Start listening for the next answer after speaking
    };
    synth.speak(utterance);
}
