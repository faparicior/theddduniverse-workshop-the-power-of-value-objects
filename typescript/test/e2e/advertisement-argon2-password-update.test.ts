import { v4 as uuid } from "uuid"
import { FrameworkRequest, Method } from "../../src/framework/FrameworkRequest";
import { FrameworkServer } from "../../src/framework/FrameworkServer";
import { SqliteConnectionFactory } from "../../src/framework/database/SqliteConnectionFactory";
import { DatabaseConnection } from "../../src/framework/database/DatabaseConnection";
import { createHash } from "node:crypto";

let connection: DatabaseConnection;
let server: FrameworkServer
const FLAT_ID = '6fa00b21-2930-483e-b610-d6b0e5b19b29';
const ADVERTISEMENT_CREATION_DATE = '2024-02-03 13:30:23';

describe("Advertisement Argon2 passwords", () => {

    beforeAll(async () => {
        connection = await SqliteConnectionFactory.createClient();
        server = await FrameworkServer.start();
        await connection.execute('delete from advertisements;', [])
    })

    beforeEach(async () => {
        await connection.execute('delete from advertisements;', [])
    })

    ////////////////////////////////////////////////////////////
    // Use this help
    // https://github.com/ranisalt/node-argon2#readme

    it("Should create a advertisement with Argon2 password", async () => {

        const description = 'Dream advertisement'
        const id = uuid()

        const request = new FrameworkRequest(Method.POST, '/advertisement',
            { id, description, password: 'myPassword' }
        )

        const response = await server.route(request)

        expect(response.statusCode).toBe(201);

        const dbData = await connection.query("SELECT * FROM advertisements") as any[]

        expect(isAnArgon2Password(dbData)).toBe(true);
    });


    it("Should change to Argon2 password updating an advertisement", async () => {
        await withAnAdvertisementWithAMd5PasswordCreated()

        const newDescription = 'Dream advertisement changed'

        const request = new FrameworkRequest(Method.PUT, `/advertisements/${FLAT_ID}`,
            { description: newDescription, password: 'myPassword' }
        )

        const response = await server.route(request)

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeUndefined;

        const dbData = await connection.query("SELECT * FROM advertisements") as any[]

        expect(isAnArgon2Password(dbData)).toBe(true);
    })

    it("Should change to Argon2 password renewing an advertisement", async () => {
        await withAnAdvertisementWithAMd5PasswordCreated()

        const request = new FrameworkRequest(Method.PATCH, `/advertisements/${FLAT_ID}`,
            { password: 'myPassword' }
        )

        const response = await server.route(request)

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeUndefined;

        const dbData = await connection.query("SELECT * FROM advertisements") as any[]

        expect(isAnArgon2Password(dbData)).toBe(true);
    })
});

async function withAnAdvertisementWithAMd5PasswordCreated(): Promise<void> {

    await connection.execute(
        `INSERT INTO advertisements (id, description, password, advertisement_date) VALUES (?, ?, ?, ?)`,
        [
            FLAT_ID,
            'Dream advertisement',
            createHash('md5').update('myPassword').digest('hex'),
            ADVERTISEMENT_CREATION_DATE
        ]);

}

function isAnArgon2Password(dbData: any[]): boolean {
    return dbData[0].password.startsWith('$argon2id$');
}
