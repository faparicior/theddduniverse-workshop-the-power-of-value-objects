package advertisement.ui.http

import advertisement.application.renewAdvertisement.RenewAdvertisementCommand
import advertisement.application.renewAdvertisement.RenewAdvertisementUseCase
import framework.FrameworkRequest
import framework.FrameworkResponse

class RenewAdvertisementController(private val useCase: RenewAdvertisementUseCase) {

    fun execute(request: FrameworkRequest): FrameworkResponse {
        useCase.execute(
            RenewAdvertisementCommand(
                request.getIdPath(),
                request.content["password"]!!,
            )
        )

        return FrameworkResponse(
            FrameworkResponse.STATUS_OK,
            mapOf(),
        )
    }
}