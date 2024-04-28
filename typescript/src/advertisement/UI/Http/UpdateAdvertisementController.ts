import { FrameworkRequest } from '../../../framework/FrameworkRequest';
import { FrameworkResponse } from '../../../framework/FrameworkResponse';
import { UpdateAdvertisementCommand } from '../../application/update-advertisement/UpdateAdvertisementCommand';
import { UpdateAdvertisementUseCase } from '../../application/update-advertisement/UpdateAdvertisementUseCase';

type AddAdvertisementRequest = FrameworkRequest & {
  body: {
    id: string;
    description: string;
    password: string;
  };
};

export class UpdateAdvertisementController {

  constructor(
    private updateAdvertisementUseCase: UpdateAdvertisementUseCase
  ) {
  }
  async execute(req: AddAdvertisementRequest): Promise<FrameworkResponse> {

    const command = new UpdateAdvertisementCommand(
      req.param,
      req.body.description,
      req.body.password
    )

    await this.updateAdvertisementUseCase.execute(command)

    return new FrameworkResponse(200)
  }
}
