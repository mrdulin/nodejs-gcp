import { traceClassDecoratorFactory } from './trace';

interface IPersonService {
  getByType: () => Promise<any>;
  operationA: () => Promise<unknown>;
}

@traceClassDecoratorFactory()
class PersonService implements IPersonService {
  public async getByType() {
    await this.operationA();
    await this.operationC('osu!mania', 2333, this.operationB);
  }
  public async operationA() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
  private async operationB() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
  private async operationC(name: string, age: number, operationB: () => Promise<unknown>) {
    console.log('name = ', name, 'age = ', age);
    await operationB();
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

export { PersonService };
