// Implementation A: Mathematical Formula (Most Efficient)
var sum_to_n_a = function(n) {
    return n * (n + 1) / 2;
};

// Implementation B: Iterative Loop (Most Readable)
var sum_to_n_b = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// Implementation C: Recursive Approach (Demonstrates Recursion)
var sum_to_n_c = function(n) {
    if (n <= 1) {
        return n;
    }
    return n + sum_to_n_c(n - 1);
};

// Implementation D: Array Reduce Method (Functional Programming Style)
var sum_to_n_d = function(n) {
    return Array.from({length: n}, (_, i) => i + 1).reduce((sum, num) => sum + num, 0);
};