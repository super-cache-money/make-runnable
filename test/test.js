var assert = require('assert');
var exec = require('child_process').execSync;

describe('an exported non-function', function() {
    it('should be simply printed out', function() {
		var cmd = "node ./test/test_module.js test_object";
		var options = {
		  encoding: 'utf8'
		};
		var cmdOutput = exec(cmd, options);
		assert.equal(cmdOutput, 
`--------make-runnable-output--------
{ test_key: 'test_value', another_test_key: 42 }
------------------------------------
`
		);
    });
});

describe('an exported function', function() {
    it("should have its output printed when called with no arguments", function() {
		var cmd = "node ./test/test_module.js test_func";
		var options = {
		  encoding: 'utf8'
		};
		var cmdOutput = exec(cmd, options);
		assert.equal(cmdOutput, 
`--------make-runnable-output--------
Passed in:
{}
------------------------------------
`
		);
    });

    it("should have its output printed when called with a primitive argument", function() {
		var cmd = "node ./test/test_module.js test_func 5";
		var options = {
		  encoding: 'utf8'
		};
		var cmdOutput = exec(cmd, options);
		assert.equal(cmdOutput, 
`--------make-runnable-output--------
Passed in:
{"0":5}
------------------------------------
`
		);
    });

    it("should have its output printed when called with an object", function() {
		var cmd = "node ./test/test_module.js test_func --java shit --lisp legit";
		var options = {
		  encoding: 'utf8'
		};
		var cmdOutput = exec(cmd, options);
		assert.equal(cmdOutput, 
`--------make-runnable-output--------
Passed in:
{"0":{"java":"shit","lisp":"legit"}}
------------------------------------
`
		);
    });

    it("should have its output printed when it returns a promise", function() {
		var cmd = "node ./test/test_module.js test_promising_func";
		var options = {
		  encoding: 'utf8'
		};
		var cmdOutput = exec(cmd, options);
		assert.equal(cmdOutput, 
`--------make-runnable-output--------
kept!!!
------------------------------------
`
		);
    });
});

