import { IContext, IPubsubEvent, Callback } from '../../gcf';
import { GlobalPartial } from 'lodash/common/common';

// async function overloadRuntimeAdapter(event: IPubsubEvent, context: IContext, callback: Callback) {
//   overloadRuntime(event, callback);
// }

async function overloadRuntimeAdaptee(event: IPubsubEvent, callback: Callback) {
  console.log('event.data: ', event.data);
  callback(null, 'overload runtime success');
}

type BackgroupCloudFunctionNodejs6Runtime = (event: IPubsubEvent, callback: Callback) => any;
type BackgroupCloudFunctionNodejs8Runtime = (event: IPubsubEvent, context: IContext, callback: Callback) => any;

function overloadRuntimeAdapter(
  // this: NodeJS.Global,
  this: void,
  adaptee: BackgroupCloudFunctionNodejs6Runtime
): BackgroupCloudFunctionNodejs8Runtime {
  const adapter = (event: IPubsubEvent, context: IContext | Callback, callback?: Callback) => {
    let cb: Callback;
    if (typeof callback === 'function') {
      cb = callback;
    } else if (typeof context === 'function') {
      cb = context;
    } else {
      throw new Error('overload runtime adapter error');
    }
    return adaptee.call(this, event, cb);
  };
  return adapter;
}
const overloadRuntimeTarget = overloadRuntimeAdapter(overloadRuntimeAdaptee);

export { overloadRuntimeTarget as overloadRuntime };
