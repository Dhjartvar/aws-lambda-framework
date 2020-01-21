import { injectable, inject } from 'inversify'
import { Mysql, Query } from '../../src/aws-lambda-framework'
import { QueryResult } from '../../src/framework/interfaces/QueryResult'
import { Kitchensink } from './Kitchensink'

@injectable()
export class KitchensinkRepository {
    @inject(Mysql) private mysql: Mysql

    async updateKitchenSink(kitchensink: Kitchensink): Promise<QueryResult<void>> {
      const query: Query = {
        sql: `
          UPDATE
            some_table (id, height, width)
          VALUES (
            ?,?,?
          )`,
        inputs: [kitchensink.id, kitchensink.height, kitchensink.width]
      }

      return this.mysql.execute(query)
    }
}