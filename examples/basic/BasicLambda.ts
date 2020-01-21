import { BaseLambda, APIGatewayProxyEvent, Context, LambdaResult } from '../../src/aws-lambda-framework'

class BasicLambda extends BaseLambda {
    constructor(event: APIGatewayProxyEvent, context: Context) {
        super(event, context)
    }

    async invoke(): Promise<LambdaResult> {
        const helloWorld = 'Hello world!'
        console.log(helloWorld)
        return {
            userMessage: helloWorld
        }
    }
    
}

export function handler(event: APIGatewayProxyEvent, context: Context) {
    return new BasicLambda(event, context)
}