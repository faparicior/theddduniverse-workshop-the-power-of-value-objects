package advertisement.domain.model

import java.util.*


data class Advertisement(val id: String?, var description: String?, var password: String?, var date: Date)
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
        this.date = Date()
    }
}
