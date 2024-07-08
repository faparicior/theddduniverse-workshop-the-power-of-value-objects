package advertisement.domain.model.value_object

import advertisement.infrastructure.PasswordHasher

class Password private constructor(private val value: String) {

    companion object {
        fun fromPlainPassword(password: String, passwordHasher: PasswordHasher): Password {
            val encryptedPassword = passwordHasher.create(password)

            return Password(encryptedPassword)
        }

        fun fromEncryptedPassword(encryptedPassword: String): Password {
            return Password(encryptedPassword)
        }
    }

    fun value(): String {
        return value
    }

    fun validateWith(password: String, passwordHasher: PasswordHasher): Boolean {
        return passwordHasher.verify(value, password)
    }
}
