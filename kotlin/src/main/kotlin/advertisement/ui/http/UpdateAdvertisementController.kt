package advertisement.ui.http

import advertisement.application.updateAdvertisement.UpdateAdvertisementCommand
import advertisement.application.updateAdvertisement.UpdateAdvertisementUseCase
import framework.FrameworkRequest
import framework.FrameworkResponse

class UpdateAdvertisementController(private val useCase: UpdateAdvertisementUseCase) {

    fun execute(request: FrameworkRequest): FrameworkResponse {
        useCase.execute(
            UpdateAdvertisementCommand(
                request.getIdPath(),
                request.content["description"]!!,
                request.content["password"]!!,
            )
        )

        return FrameworkResponse(
            FrameworkResponse.STATUS_OK,
            mapOf(),
        )
    }
}