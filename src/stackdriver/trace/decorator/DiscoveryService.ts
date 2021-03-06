import rp from 'request-promise';
import { trace, traceStaticClassDecoratorFactory } from './trace';

@traceStaticClassDecoratorFactory()
class DiscoveryService {
  public static readonly DISCOVERY_URL: string = 'https://www.googleapis.com/discovery/v1/apis';

  // @trace({ name: 'getDiscovery' })
  public static async getDiscovery() {
    console.log(this);
    await DiscoveryService.operationA();
    await DiscoveryService.operationB();
    await DiscoveryService.operationC('ez2on', 12, DiscoveryService.operationD);
    const response = await rp.get(DiscoveryService.DISCOVERY_URL, { json: true });
    const names = response.items.map((item) => item.name);
    return names;
  }

  // @trace()
  public static async operationA() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // @trace()
  public static async operationB() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // @trace()
  public static async operationC(name: string, age: number, operationD: () => Promise<unknown>) {
    await operationD();
    console.log(`name = ${name}, age = ${age}`);
  }

  // @trace()
  public static async operationD() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

export { DiscoveryService };
