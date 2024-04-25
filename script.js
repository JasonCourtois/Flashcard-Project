var contentArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
// Get the modal element
var modal = document.getElementById('settingsModal');

// Get the button that opens the modal
var btn = document.getElementById("settings_button");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// When the user clicks the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Get all anchor elements with class 'algorithm'
var algorithmLinks = document.getElementsByClassName("algorithm");

// Add click event listeners to each anchor element
for (var i = 0; i < algorithmLinks.length; i++) {
    algorithmLinks[i].addEventListener('click', function(event) {
        // Prevent the default behavior of anchor elements (preventing navigation)
        event.preventDefault();
        
        // Get the text content of the clicked anchor element
        var selectedAlgorithm = this.textContent;
        
        // You can now use the selectedAlgorithm variable as needed
        console.log("Selected algorithm:", selectedAlgorithm);
    });
}



document.getElementById("save_card").addEventListener("click", () => {
  addFlashcard();
});

document.getElementById("delete_cards").addEventListener("click", () => {
  if(confirm("Are you sure you want to delete all cards?")){ 
    localStorage.clear();
    flashcards.innerHTML = '';
    contentArray = [];
  }
});

document.getElementById("show_card_box").addEventListener("click", () => {
  document.getElementById("create_card").style.display = "block";
});

document.getElementById("close_card_box").addEventListener("click", () => {
  document.getElementById("create_card").style.display = "none";
});

document.getElementById("study_button").addEventListener("click", () => {
  if(contentArray.length == 0) {
    alert('Please add a card!');
  } else {
    window.location.href='study/index.html';
  }
})

flashcardMaker = (text, delThisIndex) => {
  const flashcard = document.createElement("div");
  const question = document.createElement('h2');
  const answer = document.createElement('h2');
  const del = document.createElement('i');
  const star = document.createElement('i');

  flashcard.className = 'flashcard';

  question.setAttribute("style", "border-top:1px solid red; padding: 15px; margin-top:30px");
  question.textContent = text.my_question;

  answer.setAttribute("style", "text-align:center; display:none; color:red");
  answer.textContent = text.my_answer;

  del.className = "fas fa-minus";
  del.addEventListener("click", () => {
    contentArray.splice(delThisIndex, 1);
    localStorage.setItem('items', JSON.stringify(contentArray));
    window.location.reload();
  })

  // Code for favorite star
  star.className = 'star_icon'

  let star_checkbox = document.createElement('input');
  star_checkbox.setAttribute('type', 'checkbox');
  star_checkbox.setAttribute('id', delThisIndex.toString());
  star_checkbox.setAttribute('class', 'favorite_button');
  star_checkbox.checked = contentArray[delThisIndex].is_favorite;
  
  star_checkbox.addEventListener("click", () => {
    contentArray[delThisIndex].is_favorite = !contentArray[delThisIndex].is_favorite;
    localStorage.setItem('items', JSON.stringify(contentArray));
  })

  let star_label = document.createElement('label');
  star_label.setAttribute('for', delThisIndex.toString());
  star_label.setAttribute('class', 'fa fa-star');


  star.appendChild(star_checkbox);
  star.appendChild(star_label);

  flashcard.appendChild(question);
  flashcard.appendChild(answer);
  flashcard.appendChild(del);
  flashcard.appendChild(star);

  flashcard.addEventListener("click", () => {
    if(answer.style.display == "none")
      answer.style.display = "block";
    else
      answer.style.display = "none";
  })

  document.querySelector("#flashcards").appendChild(flashcard);
}

contentArray.forEach(flashcardMaker);

addFlashcard = () => {
  const question = document.querySelector("#question");
  const answer = document.querySelector("#answer");

  let flashcard_info = {
    'my_question' : question.value,
    'my_answer'  : answer.value,
    'correctness' : -1,
    'is_favorite' : false,
  }

  contentArray.push(flashcard_info);
  localStorage.setItem('items', JSON.stringify(contentArray));
  flashcardMaker(contentArray[contentArray.length - 1], contentArray.length - 1);
  question.value = "";
  answer.value = "";
}
