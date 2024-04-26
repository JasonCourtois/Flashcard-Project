function mergesort(inputArray, mode){
    console.log("hit merge");

    if (inputArray.length <= 1) {
        return inputArray;
    }

    const mid = Math.floor(inputArray.length / 2);
    const right = inputArray.slice(mid);
    const left = inputArray.slice(0, mid);

    if(mode == 1) {
        return merge1(mergesort(left, 1), mergesort(right, 1));
    } else if (mode == 2) {
        return merge2(mergesort(left, 2), mergesort(right, 2));
    } else {
        alert("Mergesort called with bad mode argument.");
    }
}

function merge1(left, right) {
    let i = 0;
    let j = 0;
    let result = [];

    while (i < left.length && j < right.length) {
        if (left[i].correctness < right[j].correctness) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++; 
        }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
}

function merge2(left, right) {
    let i = 0;
    let j = 0;
    let result = [];

    while (i < left.length && j < right.length) {
        if (left[i][1].correctness < right[j][1].correctness) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++; 
        }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
}

function partition1(inputArray, low, high) {
    let pivot = inputArray[high].correctness;
    let i = low - 1;
  
    for (let j = low; j <= high - 1; j++) {
        if (inputArray[j].correctness < pivot) {
            i++;
            [inputArray[i], inputArray[j]] = [inputArray[j], inputArray[i]]; 
        }
    }

    [inputArray[i + 1], inputArray[high]] = [inputArray[high], inputArray[i + 1]]; 
    return i + 1; 
}

function partition2(inputArray, low, high) {
    let pivot = inputArray[high][1].correctness;
    let i = low - 1;
  
    for (let j = low; j <= high - 1; j++) {
        if (inputArray[j][1].correctness < pivot) {
            i++;
            [inputArray[i], inputArray[j]] = [inputArray[j], inputArray[i]]; 
        }
    }

    [inputArray[i + 1], inputArray[high]] = [inputArray[high], inputArray[i + 1]]; 
    return i + 1; 
}


function recursive_quicksort(inputArray, low, high, mode) {
    if (low < high) {
        let index
        if (mode == 1) {
            index = partition1(inputArray, low, high);
        } else if (mode == 2) {
            index = partition2(inputArray, low, high);
        } else {
            alert("Quicksort called with bad mode argument.");
        }
        

        recursive_quicksort(inputArray, low, index - 1, mode);
        recursive_quicksort(inputArray, index + 1, high, mode);
    }
}

function quicksort(inputArray, mode) {
    recursive_quicksort(inputArray, 0, inputArray.length - 1, mode);
    return inputArray;
}

export function sort_array(inputArray, mode) {
    const settings = JSON.parse(localStorage.getItem('settings'));
    if (settings.sorting == "mergesort") {
        return mergesort(inputArray, mode);
    } else if (settings.sorting == "quicksort") {
        return quicksort(inputArray, mode);
    } else {
        alert("Settings not set to 'mergesort' or 'quicksort'");
    }
}

export function compare_strings(answer, guess){
    const settings = JSON.parse(localStorage.getItem('settings'));
    if (settings.comparing == "levenstein") {
        return levenshtein_distance(answer, guess);
    } else if (settings.comparing == "sorensen") {
        return dice_coefficient(answer, guess);
    } else {
        alert("Settings not set to 'levenstein' or 'quicksort'");
    }
}


/*
    Runtime O(n*m) where n is the length of guess and m the length of answer
    Space complexity O(max(n, m)) where n is the size of the guess and m is the size of answer.
*/
export function dice_coefficient(answer, guess) {
    const answer_bigrams = getBigrams(answer);
    const guess_bigrams = getBigrams(guess);
    return (2 * intersect(answer_bigrams, guess_bigrams).size) / (answer_bigrams.size + guess_bigrams.size);
}

function getBigrams(str) {
    const bigrams = new Set();
    for (let i = 0; i < str.length - 1; i += 1) {
      bigrams.add(str.substring(i, i + 2));
    }
    return bigrams;
  }
  
  function intersect(set1, set2) {
    return new Set([...set1].filter((x) => set2.has(x)));
  }

/*
    Runtime O(n*m) where n is the length of guess and m the length of answer
    Space complexity O(n) where n is the size of the guess.
*/
export function levenshtein_distance(answer, guess) {
    const m = answer.length;
    const n = guess.length;
 
    //  Create two arrays to represent the rows of the full matrix
    let prevRow = new Array(n + 1).fill(0);
    let currRow = new Array(n + 1).fill(0);
 
    /* Set the first row equal to consecutive numbers. 
       This represents the cost of turning an empty string into the guess.
    */
    for (let j = 0; j <= n; j++) {
        prevRow[j] = j;
    }
 
    // Dynamic programming approach to fill matrix and find levenshtein distnace.
    for (let i = 1; i <= m; i++) {
        currRow[0] = i;
 
        for (let j = 1; j <= n; j++) {
            // If there characters at current position are equal, no change needed.
            if (answer[i - 1] === guess[j - 1]) {
                currRow[j] = prevRow[j - 1]; 
            } else {
                // Update cost with least expensive operation.
                currRow[j] = 1 + Math.min(
                    currRow[j - 1],   // Insert
                    prevRow[j],       // Remove
                    prevRow[j - 1]    // Replace
                );
            }
        }
 
        // Update the previous row with the current row for the next iteration
        prevRow = [...currRow];
    }
 
    // The result is the value at the bottom-right corner of the matrix
    /*
        Old return: return currRow[n];
    */
    return (1 - (currRow[n]/Math.max(n, m)));
}