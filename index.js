var argv = require('yargs').argv;

// if the requiring file is being run directly from the command line
if (require.main === module.parent) {
  var targetPropertyFound = false;

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
      console.log(func(namedArgs));
    } else if (unnamedArgs.length > 0) {
      //we have 1 or more unnamed arguments. let's pass those as individual args to function
      console.log(func.apply(null, unnamedArgs));
    } else {
      //no extra arguments given to pass to function. let's just run it
      console.log(func());
    }
  }

  // if the module exports a function, then evidently no target property could be specified
  // all the rest of the target properties must then be the unnamed arguments to the function
  if (module.parent.exports instanceof Function) {
    targetPropertyFound = true;
    runFuncWithArgs(module.parent.exports, argv._.slice(0));
  } else if (argv._.length > 0) {
    // there must be at least one argument which specifies the target property to run/show
    var targetProperty = argv._[0];
    if (targetProperty in module.parent.exports) {
      targetPropertyFound = true;

      // if the target is a function, we need to run it with any provided args
      if (module.parent.exports[targetProperty] instanceof Function) {

        runFuncWithArgs(module.parent.exports[targetProperty], argv._.slice(1));
      } else {// if the target isn't a function, we simply print it
        console.log(module.parent.exports[targetProperty]);
      }
    }
  }

  // the specified first arg didn't match up to any of the exported properties
  if (!targetPropertyFound) {
    var validProperties = Object.keys(module.parent.exports);
    if (validProperties.length === 0) {
      console.error("The module you're trying to make runnable doesn't export anything.");
    } else { // let's give an example of how this should be used
      var validFunctionProperties = validProperties.filter(function(prop){
        return module.parent.exports[prop] instanceof Function
      });

      console.log('validProps', validProperties);
      console.log('validFuncs', validFunctionProperties);

      // ideally the examples should use a function so it makes sense
      var egProperty = validFunctionProperties.length > 0 ? validFunctionProperties[0] : validProperties[0];

      console.log('egProperty', egProperty);
      // the example changes based on whether the property name contains a space
      var egPropertyHasSpace = egProperty.indexOf(' ') > 0; //if example property
      var egPropertyAsArg = egPropertyHasSpace ? '"' + egProperty + '"' : egProperty;

      var example = 'node ' + argv.$0 + ' ' + egPropertyAsArg + ' xyz';
      example += ' → ';
      example += 'module.exports' + (egPropertyHasSpace ? '[' + egPropertyAsArg + ']': '.' + egProperty) + '("xyz")'
      console.error('One of the following must be specified as an argument, to run/print the corresponding function/property:', Object.keys(module.parent.exports), '\n');
      console.error('Example:\n', example);
    }
  }
} else {
  delete require.cache[__filename]; // needed with nested make-runnables
}
