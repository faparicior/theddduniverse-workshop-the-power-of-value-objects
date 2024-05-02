import {Password} from "../../../../../../src/advertisement/domain/model/value-object/Password";


describe("Advertisement password", () => {

    const STRONG_HASH_PASSWORD = "$argon2id$v=19$m=65536,t=3,p=4$nkSfCHyHihg2PTiEcMIeQA$Psr9aMr6eo9ymvk4BP4LIyNp9tCAvfdichM+paCPo/w"
    const WEAK_HASH_PASSWORD = "5f4dcc3b5aa765d61d8327deb882cf99"

    beforeAll(async () => {
    })

    beforeEach(async () => {
    })

    it("Should not be instantiated using the constructor", async () => {
        const functions = Object.getOwnPropertyNames(Password);

        expect(functions.includes('constructor')).toBe(false);
    });

    it("Should be created with a strong algorithm", async () => {
        let password = await Password.fromPlainPassword("password");

        expect(password.value().startsWith('$argon2')).toBe(true) ;
    });

    it("Should be created with encrypted value without change the original hash", async () => {
        let strongPassword = Password.fromEncryptedPassword(STRONG_HASH_PASSWORD);
        let weakPassword = Password.fromEncryptedPassword(WEAK_HASH_PASSWORD);

        expect(strongPassword.value()).toEqual(STRONG_HASH_PASSWORD);
        expect(weakPassword.value()).toEqual(WEAK_HASH_PASSWORD);
    });

    it("Should validate passwords with a strong algorithm", async () => {
        let password = Password.fromEncryptedPassword(STRONG_HASH_PASSWORD);

        expect(await password.isValid("password")).toBe(true);
    });

    it("Should validate passwords with a weak algorithm", async () => {
        let password = Password.fromEncryptedPassword(WEAK_HASH_PASSWORD);

        expect(await password.isValid("password")).toBe(true);
    });
});
