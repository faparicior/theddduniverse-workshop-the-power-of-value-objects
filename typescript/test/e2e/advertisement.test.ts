import { v4 as uuid } from "uuid"
import { FrameworkRequest, Method } from "../../src/framework/FrameworkRequest";
import { FrameworkServer } from "../../src/framework/FrameworkServer";
import { SqliteConnectionFactory } from "../../src/framework/database/SqliteConnectionFactory";
import { DatabaseConnection } from "../../src/framework/database/DatabaseConnection";
import { createHash } from "node:crypto";
import { Advertisement } from "../../src/advertisement/domain/model/Advertisement";

let connection: DatabaseConnection;
let server: FrameworkServer
const FLAT_ID = '6fa00b21-2930-483e-b610-d6b0e5b19b29';
const ADVERTISEMENT_CREATION_DATE = '2024-02-03 13:30:23';

describe("Advertisement", () => {


    beforeAll(async () => {
        connection = await SqliteConnectionFactory.createClient();
        server = await FrameworkServer.start();
        await connection.execute('delete from advertisements;', [])
    })

    beforeEach(async () => {
        await connection.execute('delete from advertisements;', [])
    })

    it("Should create a advertisement", async () => {

        const description = 'Dream advertisement'
        const id = uuid()

        const request = new FrameworkRequest(Method.POST, '/advertisement',
            { id, description, password: 'myPassword' }
        )

        const response = await server.route(request)

        expect(response.statusCode).toBe(201);

        const dbData = await connection.query("SELECT * FROM advertisements") as any[]

        expect(dbData.length).toBe(1);
        expect(dbData[0].id).toBe(id);
        expect(dbData[0].description).toBe(description);
        expect(dbData[0].password).toBeDefined;
        expect(dbData[0].advertisement_date).toBeDefined;

    });


    it("Should change an advertisement", async () => {
        await withAnAdvertisementCreated()

        const newDescription = 'Dream advertisement changed'

        const request = new FrameworkRequest(Method.PUT, `/advertisements/${FLAT_ID}`,
            { description: newDescription, password: 'myPassword' }
        )

        const response = await server.route(request)

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeUndefined;

        const dbData = await connection.query("SELECT * FROM advertisements") as any[]

        expect(dbData.length).toBe(1);
        expect(dbData[0].description).toBe(newDescription);
        const newDate = new Date(dbData[0].advertisement_date)
        const diff = getHourDifference(newDate)
        expect(diff).toBeLessThan(1)

    })
});


async function withAnAdvertisementCreated(): Promise<void> {

    await connection.execute(
        `INSERT INTO advertisements (id, description, password, advertisement_date) VALUES (?, ?, ?, ?)`,
        [
            FLAT_ID,
            'Dream advertisement',
            createHash('md5').update('myPassword').digest('hex'),
            ADVERTISEMENT_CREATION_DATE
        ]);

}

function getHourDifference(date: Date): number {

    const currentDate = new Date();
    const differenceInMs = currentDate.getTime() - date.getTime();
    const differenceInHours = differenceInMs / (1000 * 60 * 60);
    return differenceInHours;
}
