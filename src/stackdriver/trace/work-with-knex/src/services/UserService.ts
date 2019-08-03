import { connection as knex } from '../db';
import { traceClassDecoratorFactory } from '../decorator/trace';
// tslint:disable-next-line: no-var-requires
// const tracer = require('@google-cloud/trace-agent').get();

interface IUserService {
  findAll(): Promise<any[]>;
}
@traceClassDecoratorFactory()
class UserService implements IUserService {
  public async findAll() {
    // const span = tracer.createChildSpan({ name: 'findAll' });
    await this.operationA();
    const query = `select * from users;`;
    // span.endSpan();
    return knex.raw(query).get('rows');
  }

  private async operationA() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

export { UserService };
