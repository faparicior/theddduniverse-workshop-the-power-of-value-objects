import argon2, {hash, Options} from "argon2";
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
        if (this._password === createHash('md5').update(password).digest('hex')) {
            return true
        }

        return argon2.verify(this._password, password)
    }

    public value(): string {
        return this._password
    }
}
