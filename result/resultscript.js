let answers = JSON.parse(localStorage.getItem('answers'));

let results_table = document.getElementById('results_table');

document.getElementById("home_button").addEventListener("click", () => {
    window.location.href='../index.html';
})

displayResult = () => {

    for (let i = answers.length - 1; i >= 0; i--)
    {
        const tr = document.createElement('tr');

        const question = document.createElement('td');
        const correct_answer = document.createElement('td');
        const your_input_answer = document.createElement('td');
        const score = document.createElement('td');
        

        question.innerHTML = answers[i][1].my_question;
        correct_answer.innerHTML = answers[i][1].my_answer;
        your_input_answer.innerHTML = answers[i][0];
        score.innerHTML = (answers[i][1].correctness * 100).toFixed(0) + "%";

        tr.appendChild(question);
        tr.appendChild(correct_answer);
        tr.appendChild(your_input_answer);
        tr.appendChild(score);

        results_table.appendChild(tr);
    }
}

displayResult();
