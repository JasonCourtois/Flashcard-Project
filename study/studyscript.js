import { mergesort } from './sorting.js';
/*
    Content array stores all of the flashcards unsorted
    Study array at first stores favorite items only, then not favorites are concatanted at the end
    Not favorites only stote non favoirte items

    Structure of code:
    1) Get original array, parse into favorite/not favorite
    2) Sort 2 arrays, concatonate them
    3) Setup array for user answers
    4) Setup refrences to parts of HTML elements
    5) Setup question on screen, then add event listeners.
*/
// 1)
var content_array = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
let study_array = [];
let not_favorites = [];

// Go through content array and find favorite and not favorite
for (let flashcard of content_array) {
    if (flashcard.is_favorite) {
        study_array.push(flashcard);
    } else {
        not_favorites.push(flashcard);
    }
}

// 2)
study_array = mergesort(study_array);
not_favorites = mergesort(not_favorites);
study_array = study_array.concat(not_favorites);

// 3)
let user_answers = [];  // Index 0: User answer, Index 1: refrence to flashcard in content array

for (let i = 0; i < study_array.length; i++) {
    user_answers.push(["", study_array[i]]);
}

// 4)
let progress = 0
const progress_bar = document.getElementById('progress_bar');
const question = document.getElementById("question_header");
const answer_box =  document.getElementById("answer");
const favorite_icon = document.getElementById("study_favorite_button");
const submit_button = document.getElementById("submit_answer_button");
const number_of_cards = study_array.length;

// 5)
move(progress);

document.getElementById("back_arrow").addEventListener("click", () => {
    if (progress - 1 >= 0) { 
        progress--;
        move(progress);
    }
})

document.getElementById("next_arrow").addEventListener("click", () => {
    if (progress + 2 <= number_of_cards) { 
        progress++;
        move(progress);
    }
})

document.getElementById("study_favorite_button").addEventListener("click", () => {
    study_array[progress].is_favorite = !study_array[progress].is_favorite;
    localStorage.setItem('items', JSON.stringify(content_array));
})

document.getElementById("finish_button").addEventListener("click", () => {
    if (confirm("Are you sure you want to finish studying?")) {
        localStorage.setItem('answers', JSON.stringify(user_answers));
        document.getElementById("finsh_button").disabled = true;
    } 
})

submit_button.addEventListener("click", () => {
    let answer = document.querySelector("#answer").value
    if (user_answers[progress][0] == "" && answer != "") {
        user_answers[progress][0] = answer;
        submit_button.disabled = true;
    }
})

function move (progress) {
    submit_button.disabled = user_answers[progress][0] == "" ? false : true;
    progress_bar.textContent = (progress + 1) + '/' + number_of_cards;
    question.textContent = study_array[progress].my_question;
    answer_box.value = user_answers[progress][0];
    favorite_icon.checked = study_array[progress].is_favorite;
}

