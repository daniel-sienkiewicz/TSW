var__ = require('underscore');

var fib = function fib(arg) {
    if (arg <= 0) {
        return 0;
    }

    if (arg === 1) {
        return 1;
    }
    
    return fib(arg - 1) + fib(arg - 2);
};

var memo = function (cache, fun) {
   return memo(cache.push(fun()), fun);
};

var fibonacci = memo([0, 1], function (recur, n) {
    return recur(n - 1) + recur(n - 2);
});

for(var n = 0 ; n < 15; n++){
	if(fibonacci(n) === fib(n)){
		console.log("n = " + n + ", " + fibonacci(n) + " === " + fib(n));
	}
}