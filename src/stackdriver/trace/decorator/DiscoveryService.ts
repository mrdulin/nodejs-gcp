import rp from 'request-promise';
import { trace } from './trace';
import { logger } from '../../../utils';

class DiscoveryService {
  public static readonly DISCOVERY_URL = 'https://www.googleapis.com/discovery/v1/apis';

  @trace({ name: 'getDiscovery' })
  public static async getDiscovery() {
    try {
      const response = await rp.get(DiscoveryService.DISCOVERY_URL, { json: true });
      const names = response.items.map((item) => item.name);
      return names;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }
}

export { DiscoveryService };
