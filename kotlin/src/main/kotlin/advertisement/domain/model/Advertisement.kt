package advertisement.domain.model

import java.time.LocalDateTime

data class Advertisement(val id: String?, var description: String?, var password: String?, var date: LocalDateTime)
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
