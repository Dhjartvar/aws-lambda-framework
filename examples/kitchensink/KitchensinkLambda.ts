import { BaseLambda, APIGatewayProxyEvent, Context, LambdaResult, LambdaContainer, Property } from '../../src/aws-lambda-framework'
import { inject } from 'inversify'
import { KitchensinkRepository } from './KitchensinkRepository'
import { UpdateKitchensinkRequest } from './UpdateKitchensinkRequest'
import { validatePermissions } from './validatePermissions'
import { validateRequest } from './validateRequest'

class KitchensinkLambda extends BaseLambda {
    @inject(KitchensinkRepository) private repo: KitchensinkRepository
    request: UpdateKitchensinkRequest

    constructor(event: APIGatewayProxyEvent, context: Context) {
        super(event, context)
        this.request = LambdaContainer.get<UpdateKitchensinkRequest>(Property.EVENT_BODY)
    }

    async invoke(): Promise<LambdaResult> {
        validatePermissions(['Superusers'])
        await validateRequest(this.request)
        
        const res = await this.repo.updateKitchenSink(this.request.updatedKitchensink)

        return {
            userMessage: 'Successfully updated Kitchensink!',
            data: res.metadata
        }
    }
    
}

export function handler(event: APIGatewayProxyEvent, context: Context) {
    return new KitchensinkLambda(event, context)
}