import rp from 'request-promise';
import { trace } from './trace';

class DiscoveryService {
  public static readonly DISCOVERY_URL = 'https://www.googleapis.com/discovery/v1/apis';

  @trace({ name: 'getDiscovery' })
  public static async getDiscovery() {
    const response = await rp.get(DiscoveryService.DISCOVERY_URL, { json: true });
    const names = response.items.map((item) => item.name);
    return names;
  }
}

export { DiscoveryService };
