function trace(options?: { name: string }) {
  // tslint:disable-next-line: no-var-requires
  const tracer = require('@google-cloud/trace-agent').get();
  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
    const orignalFunction = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      const spanName = (options ? options.name : '') || orignalFunction.name || propertyKey;
      const childSpan = tracer.createChildSpan({ name: spanName });
      const rval = await orignalFunction.apply(this, args);
      childSpan.endSpan();
      return rval;
    };
  };
}

export { trace };
