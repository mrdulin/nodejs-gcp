import rp from 'request-promise';
import { trace } from './trace';

class DiscoveryService {
  public static readonly DISCOVERY_URL = 'https://www.googleapis.com/discovery/v1/apis';

  @trace({ name: 'getDiscovery' })
  public static async getDiscovery() {
    await DiscoveryService.operationA();
    await DiscoveryService.operationB();
    const response = await rp.get(DiscoveryService.DISCOVERY_URL, { json: true });
    const names = response.items.map((item) => item.name);
    return names;
  }

  @trace()
  public static async operationA() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }

  @trace()
  public static async operationB() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

export { DiscoveryService };
