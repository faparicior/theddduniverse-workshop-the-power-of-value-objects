package framework

import advertisement.application.publishAdvertisement.PublishAdvertisementUseCase
import advertisement.application.renewAdvertisement.RenewAdvertisementUseCase
import advertisement.application.updateAdvertisement.UpdateAdvertisementUseCase
import advertisement.domain.AdvertisementRepository
import advertisement.infrastructure.PasswordHasher
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
                this.advertisementRepository(),
                this.hashFactory()
            )
        )
    }

    fun updateAdvertisementController(): UpdateAdvertisementController {
        return UpdateAdvertisementController(
            UpdateAdvertisementUseCase(
                this.advertisementRepository(),
                this.hashFactory()
            )
        )
    }

    fun renewAdvertisementController(): RenewAdvertisementController {
        return RenewAdvertisementController(
            RenewAdvertisementUseCase(
                this.advertisementRepository(),
                this.hashFactory()
            )
        )
    }

    fun advertisementRepository(): AdvertisementRepository {
        return SqLiteAdvertisementRepository(
            this.connection()
        )
    }

    fun hashFactory(): PasswordHasher {
        return PasswordHasher()
    }

    fun connection(): DatabaseConnection {
        return SqliteConnection.getInstance()
    }
}