import { Database } from "sqlite";
import { PublishAdvertisementController } from "../advertisement/UI/Http/PublishAdvertisementController";
import { PublishAdvertisementUseCase } from "../advertisement/application/publish-advertisement/PublishAdvertisementUseCase";
import { SqliteAdvertisementRepository } from "../advertisement/infrastructure/SqliteAdvertisementRepository";
import { FrameworkRequest } from "./FrameworkRequest";
import { FrameworkResponse } from "./FrameworkResponse";
import { DatabaseConnection } from "./database/DatabaseConnection";
import { SqliteConnectionFactory } from "./database/SqliteConnectionFactory";
import { UpdateAdvertisementUseCase } from "../advertisement/application/update-advertisement/UpdateAdvertisementUseCase";
import { UpdateAdvertisementController } from "../advertisement/UI/Http/UpdateAdvertisementController";

export class FrameworkServer {

  private constructor(
    private publishAdvertisementController: PublishAdvertisementController,
    private updatedAvertisementController: UpdateAdvertisementController
  ) { };

  static async start(): Promise<FrameworkServer> {
    const connection = await SqliteConnectionFactory.createClient();
    const advertisementRepository = new SqliteAdvertisementRepository(connection);
    const publishAdvertisementUseCase = new PublishAdvertisementUseCase(advertisementRepository);
    const updateAdvertisementUseCase = new UpdateAdvertisementUseCase(advertisementRepository);
    const publishAdvertisementController = new PublishAdvertisementController(publishAdvertisementUseCase)
    const updatedAvertisementController = new UpdateAdvertisementController(updateAdvertisementUseCase)

    return new FrameworkServer(publishAdvertisementController, updatedAvertisementController);

  }

  async route(request: FrameworkRequest): Promise<FrameworkResponse> {

    const route = `${request.method}:/${request.path}`

    switch (route) {
      case "POST:/advertisement":
        return await this.publishAdvertisementController.execute(request)
      case "PUT:/advertisements":
        return await this.updatedAvertisementController.execute(request)
      default:
        return Promise.resolve(new FrameworkResponse(404, { message: "Not Found" }))
    }

  }
}


