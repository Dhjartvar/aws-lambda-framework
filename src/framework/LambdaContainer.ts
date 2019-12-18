import { Container } from 'inversify'
import 'reflect-metadata'

const LambdaContainer = new Container({
  autoBindInjectable: true,
  skipBaseClassChecks: true,
  defaultScope: 'Singleton'
})

export default LambdaContainer
