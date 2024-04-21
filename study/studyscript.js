import { mergesort } from './sorting.js';
/*
    Content array stores all of the flashcards unsorted
    Study array at first stores favorite items only, then not favorites are concatanted at the end
    Not favorites only stote non favoirte items
*/
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

study_array = mergesort(study_array);
not_favorites = mergesort(not_favorites);
study_array = study_array.concat(not_favorites);

let user_answers = [];

for (let i = 0; i < study_array.length; i++) {
    user_answers.push("");
}

let progress = 0
const progress_bar = document.getElementById('progress_bar');
const question = document.getElementById("question_header");
const answer_box =  document.getElementById("answer");
const number_of_cards = study_array.length;

move(progress);

console.log(user_answers)

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

document.getElementById("submit_answer_button").addEventListener("click", () => {
    if (user_answers[progress] == "") {
        user_answers[progress] = document.querySelector("#answer").value;
        console.log(user_answers);
    }
})


function move (progress) {
    progress_bar.textContent = (progress + 1) + '/' + number_of_cards;
    question.textContent = study_array[progress].my_question;
    answer_box.value = user_answers[progress];
}

