var argv = require('yargs').argv;
// if the requiring file is being run directly from the command line

if (require.main === module.parent) {
    console.log('here!!');


  function runFuncWithArgs(func, unnamedArgs){
    console.log('running func', unnamedArgs);
    var namedArgs = Object.assign({},argv);
    delete namedArgs._;
    delete namedArgs.$0;

    if (Object.keys(namedArgs).length > 0 && unnamedArgs.length > 0) {
      console.error('You cannot specify both named and unnamed arguments to the function');
      process.exit(1);
    } else if (Object.keys(namedArgs).length > 0) {
      //we have named arguments. Let's pass these as an object to the function
      func(namedArgs);
    } else if (unnamedArgs.length > 0) {
      //we have 1 or more unnamed arguments. let's pass those as individual args to function
      func.apply(null, unnamedArgs);
    } else {
      //no extra arguments given to pass to function. let's just run it
      func();
    }
  }

  if (!module.parent.exports) {
    console.error('No module exports were found. Make sure you require make-runnable at the end of your file.');
    process.exit(1);
  }

  var targetPropertyFound = false;

  // there must be at least one argument which specifies the target property to run/show
  if (argv._.length > 0) {
    var targetProperty = argv._[0];
    if (targetProperty in module.parent.exports) {
      targetPropertyFound = true;

      // if the target is a function, we need to run it with any provided args
      if (module.parent.exports[targetProperty] instanceof Function) {
        var unnamedArgs = argv._.slice(1);
        runFuncWithArgs(module.parent.exports[targetProperty], unnamedArgs);
      } else {// if the target isn't a function, we simply print it
        console.log(module.parent.exports[targetProperty]);
      }
    }
  }

  // the specified first arg didn't match up to any of the exported properties
  if (!targetPropertyFound) {

    if (module.parent.exports instanceof Function) {
      runFuncWithArgs(module.parent.exportsunnamedArgs);
    }

    var validProperties = Object.keys(module.parent.exports);
    if (validProperties.length < 0) {
      console.error("The module you're trying to make runnable doesn't export anything.");
    } else { // let's give an example of how this should be used
      var validFunctionProperties = validProperties.filter(function(prop){
        return module.parent.exports[prop] instanceof Function
      });

      // ideally the examples should use a function so it makes sense
      var egProperty = validFunctionProperties.length > 0 ? validFunctionProperties[0] : validProperties[0];

      // the example changes based on whether the property name contains a space
      var egPropertyHasSpace = egProperty.indexOf(' ') > 0; //if example property
      var egPropertyAsArg = egPropertyHasSpace ? '"' + egProperty + '"' : egProperty;

      var example = 'node ' + argv.$0 + ' ' + egPropertyAsArg + ' xyz';
      example += ' → ';
      example += 'module.exports' + (egPropertyHasSpace ? '[' + egPropertyAsArg + ']': '.' + egProperty) + '("xyz")'
      console.error('One of the following must be specified as an argument, to run/print the corresponding function/property:', Object.keys(module.parent.exports), '\n');
      console.error('Example:\n', example);
      process.exit(1);
    }
  }
}
