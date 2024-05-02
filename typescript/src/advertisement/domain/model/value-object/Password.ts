import argon2 from "argon2";
import {createHash} from "node:crypto";

export class Password {

    private constructor(
        private readonly _password: string,
    ) {
    }

    public static async fromPlainPassword(password: string): Promise<Password> {
        const hash = await argon2.hash(password);

        return new Password(hash)
    }

    public static fromEncryptedPassword(password: string): Password {
        return new Password(password)
    }

    public async isValid(password: string): Promise<boolean> {
        if (this._password.startsWith('$argon2'))
            return argon2.verify(this._password, password)

        return this._password === createHash('md5').update(password).digest('hex')
    }

    public value(): string {
        return this._password
    }
}
