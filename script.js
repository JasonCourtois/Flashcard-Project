var contentArray = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

if(!localStorage.getItem('settings')) {
  localStorage.setItem('settings', JSON.stringify({'sorting' : 'mergesort', 'comparing' : 'sorensen'}));
}

var settings = JSON.parse(localStorage.getItem('settings'));

document.getElementById(settings.sorting).checked = true;
document.getElementById(settings.comparing).checked = true;


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

// Setup for event listeners on radio elements
var algorithmLinks = document.getElementsByClassName("algorithm");

// Add click event listeners to each element
for (var i = 0; i < algorithmLinks.length; i++) {
    algorithmLinks[i].addEventListener('click', function(event) {    
        if (this.classList.contains("sorting")) {
          settings.sorting = this.value;
        } else if (this.classList.contains("comparing")) {
          settings.comparing = this.value;
        }
        localStorage.setItem('settings', JSON.stringify(settings));
    });
}

document.getElementById("import_card_button").addEventListener("click", () => {
  var input = document.createElement("input");
  input.type = "file";
  input.click();
  contentArray = []
  // Listen for change event when user selects a file
  input.addEventListener("change", function() {
    var file = input.files[0]; // Get the selected file
    if (file) {
      // File was selected, read its contents
      var reader = new FileReader();
      reader.onload = function(event) {
          var content = event.target.result; // Content of the file
          try {
              // Parse the JSON data
              var data = JSON.parse(content);
              contentArray = data
              localStorage.setItem('items', JSON.stringify(contentArray));
              // Process the data (data is now a JavaScript object)
          } catch (error) {
              console.error("Error parsing JSON:", error);
          }
      };
      // Read the file as text
      reader.readAsText(file);
   }
   location.reload();
  });
});

document.getElementById("export_card_button").addEventListener("click", () => {
  if (contentArray.length == 0) {
    alert("Please add at least one card before exporting!");
    return;
  }
  const output = JSON.stringify(contentArray, null, 2);
  const blob = new Blob([output], { type: 'application/json' });

  // Create a temporary anchor element
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'data.json';

  // Append the anchor element to the document body
  document.body.appendChild(a);

  // Trigger a click event on the anchor element
  a.click();

  // Remove the anchor element from the document body
  document.body.removeChild(a);
});

document.getElementById("save_card").addEventListener("click", () => {
  addFlashcard();
});

document.getElementById("delete_cards").addEventListener("click", () => {
  if(confirm("Are you sure you want to delete all cards?")){ 
    var temp = JSON.parse(localStorage.getItem('settings'));
    localStorage.clear();
    flashcards.innerHTML = '';
    contentArray = [];
    localStorage.setItem('settings', JSON.stringify(temp));
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
