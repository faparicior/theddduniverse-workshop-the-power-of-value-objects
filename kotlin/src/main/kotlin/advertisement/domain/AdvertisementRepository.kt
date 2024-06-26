package advertisement.domain

import advertisement.domain.model.Advertisement

interface AdvertisementRepository {
    fun save(advertisement: Advertisement)
    fun findById(id: String): Advertisement
}