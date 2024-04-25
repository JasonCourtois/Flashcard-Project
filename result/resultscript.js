let answers = JSON.parse(localStorage.getItem('answers'));

let results_table = document.getElementById('results_table');

displayResult = () => {

    for (let answer of answers)
    {
        const tr = document.createElement('tr');

        const question = document.createElement('td');
        const correct_answer = document.createElement('td');
        const your_input_answer = document.createElement('td');

        question.innerHTML = answer[1].my_question;
        correct_answer.innerHTML = answer[1].my_answer;
        your_input_answer.innerHTML = answer[0];

        tr.appendChild(question);
        tr.appendChild(correct_answer);
        tr.appendChild(your_input_answer);

        results_table.appendChild(tr);
    }
}

displayResult();
