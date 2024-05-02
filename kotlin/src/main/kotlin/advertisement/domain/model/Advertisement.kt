package advertisement.domain.model

import advertisement.domain.model.value_object.Password
import java.time.LocalDateTime

data class Advertisement(val id: String?, var description: String?, var password: Password?, var date: LocalDateTime)
{
    fun update(description: String?)
    {
        this.description = description
        updateDate()
    }

    fun renew()
    {
        updateDate()
    }

    private fun updateDate()
    {
        this.date = LocalDateTime.now()
    }
}
