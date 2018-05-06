import { credentials } from '../../../credentials';

// tslint:disable-next-line:no-var-requires
const tracer = require('@google-cloud/trace-agent').start({
  projectId: credentials.PROJECT_ID,
  keyFilename: credentials.STACKDRIVER_TRACE_ADMIN_CREDENTIAL
});

function trace(options: { name: string }) {
  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
    const orignalFunction = descriptor.value;
    descriptor.value = async function(...args) {
      const childSpan = tracer.createChildSpan({ name: options.name });
      const rval = await orignalFunction.apply(this, args);
      childSpan.endSpan();
      return rval;
    };
  };
}

export { tracer, trace };
