function traceClassDecoratorFactory() {
  const tracer = require('@google-cloud/trace-agent').get();
  return function traceClassDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
    // https://stackoverflow.com/questions/37771418/iterate-through-methods-and-properties-of-an-es6-class
    // for es5
    // const instanceMethods = Object.keys(constructor.prototype).filter((prop) => {
    //   console.log('prop', prop);
    //   return typeof constructor.prototype[prop] === 'function';
    // });

    // for es6
    const instanceMethods = Object.getOwnPropertyNames(constructor.prototype).filter(
      (prop) => typeof constructor.prototype[prop] === 'function' && constructor.prototype[prop] !== constructor
    );

    console.log('instanceMethods: ', JSON.stringify(instanceMethods));
    // console.log('tracer', tracer);

    for (const instanceMethod of instanceMethods) {
      const originalInstanceMethod = constructor.prototype[instanceMethod];
      constructor.prototype[instanceMethod] = async (...args: any[]) => {
        const childSpan = tracer.createChildSpan({ name: instanceMethod });
        childSpan.addLabel('class', constructor.name);
        childSpan.addLabel('args', args);
        childSpan.addLabel('traceContext', childSpan.getTraceContext());
        const rval = await originalInstanceMethod.apply(constructor.prototype, args);
        childSpan.endSpan();
        return rval;
      };
    }

    return constructor;
  };
}

export { traceClassDecoratorFactory };
