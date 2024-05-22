package framework

import advertisement.application.publishAdvertisement.PublishAdvertisementUseCase
import advertisement.application.renewAdvertisement.RenewAdvertisementUseCase
import advertisement.application.updateAdvertisement.UpdateAdvertisementUseCase
import advertisement.domain.AdvertisementRepository
import advertisement.infrastructure.persistence.SqLiteAdvertisementRepository
import advertisement.ui.http.PublishAdvertisementController
import advertisement.ui.http.RenewAdvertisementController
import advertisement.ui.http.UpdateAdvertisementController
import framework.database.DatabaseConnection
import framework.database.SqliteConnection

class DependencyInjectionResolver {
    fun publishAdvertisementController(): PublishAdvertisementController {
        return PublishAdvertisementController(
            PublishAdvertisementUseCase(
                this.advertisementRepository()
            )
        )
    }

    fun updateAdvertisementController(): UpdateAdvertisementController {
        return UpdateAdvertisementController(
            UpdateAdvertisementUseCase(
                this.advertisementRepository()
            )
        )
    }

    fun renewAdvertisementController(): RenewAdvertisementController {
        return RenewAdvertisementController(
            RenewAdvertisementUseCase(
                this.advertisementRepository()
            )
        )
    }

    fun advertisementRepository(): AdvertisementRepository {
        return SqLiteAdvertisementRepository(
            this.connection()
        )
    }

    fun connection(): DatabaseConnection {
        return SqliteConnection.getInstance()
    }
}