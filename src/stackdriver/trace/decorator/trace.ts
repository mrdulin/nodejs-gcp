function traceMethodDecoratorFactory(options?: { name: string }) {
  const tracer = require('@google-cloud/trace-agent').get();
  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
    const orignalFunction = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      const spanName = (options ? options.name : '') || orignalFunction.name || propertyKey;
      const childSpan = tracer.createChildSpan({ name: spanName });
      childSpan.addLabel('class', target.name);
      childSpan.addLabel('args', args);
      const rval = await orignalFunction.apply(this, args);
      childSpan.endSpan();
      return rval;
    };
  };
}

function traceStaticClassDecoratorFactory() {
  const tracer = require('@google-cloud/trace-agent').get();
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    const staticMethods = Object.keys(constructor).filter((prop) => typeof constructor[prop] === 'function');

    for (const staticMethod of staticMethods) {
      const originalStaticMethod = constructor[staticMethod];
      constructor[staticMethod] = async (...args: any[]) => {
        const childSpan = tracer.createChildSpan({ name: staticMethod });
        childSpan.addLabel('class', constructor.name);
        childSpan.addLabel('args', args);
        childSpan.addLabel('traceContext', childSpan.getTraceContext());
        const rval = await originalStaticMethod.apply(constructor, args); // TODO: apply context
        childSpan.endSpan();
        return rval;
      };
    }

    return constructor;
  };
}

function traceClassDecoratorFactory() {
  const tracer = require('@google-cloud/trace-agent').get();
  return function traceClassDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
    const instanceMethods = Object.keys(constructor.prototype).filter(
      (prop) => typeof constructor.prototype[prop] === 'function'
    );

    // console.log('instanceMethods: ', JSON.stringify(instanceMethods));

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

export { traceMethodDecoratorFactory as trace, traceStaticClassDecoratorFactory, traceClassDecoratorFactory };
