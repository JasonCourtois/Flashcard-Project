export function mergesort(inputArray){
    if (inputArray.length <= 1) {
        return inputArray;
    }

    const mid = Math.floor(inputArray.length / 2);
    const right = inputArray.slice(mid);
    const left = inputArray.slice(0, mid);

    return merge(mergesort(left), mergesort(right));
}

function merge(left, right) {
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