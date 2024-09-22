import { ModelCtor, Sequelize, SequelizeOptions} from 'sequelize-typescript'

class DBConnection {
  private readonly models: ModelCtor[]
  private sequelize: Sequelize

  constructor(options: SequelizeOptions, models: ModelCtor[]) {
    this.sequelize = new Sequelize({
      ...options,
      host: '127.0.0.1',
      dialect: 'postgres',
      // logging: (msg) => console.debug(msg)
      logging: false
    })
    this.models = models
  }

  public async connect (): Promise<void> {
    try {
      await this.sequelize.authenticate()
      await this.sequelize.sync()
    } catch (error) {
      console.error(error)
    }
  }

  public appendModels () {
    try {
      this.sequelize.addModels(this.models)
    } catch (error) {
      console.error(error)
    }
  }

  public async initDbConnection () {
    try {
      this.appendModels()
      await this.connect()

      console.debug('Database initialized')
    } catch (error) {
      console.error(error)
    }
  }
}

export default DBConnection
