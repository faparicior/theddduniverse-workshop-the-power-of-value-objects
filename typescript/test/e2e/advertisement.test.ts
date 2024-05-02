import { FrameworkRequest, Method } from "../../src/framework/FrameworkRequest";
import { FrameworkServer } from "../../src/framework/FrameworkServer";
import { SqliteConnectionFactory } from "../../src/framework/database/SqliteConnectionFactory";
import { DatabaseConnection } from "../../src/framework/database/DatabaseConnection";
import { createHash } from "node:crypto";

let connection: DatabaseConnection;
let server: FrameworkServer
const ID = '6fa00b21-2930-483e-b610-d6b0e5b19b29';
const ADVERTISEMENT_CREATION_DATE = '2024-02-03 13:30:23';
const DESCRIPTION = 'Dream advertisement';
const PASSWORD = 'myPassword';
const NEW_DESCRIPTION = 'Dream advertisement changed';
const INCORRECT_PASSWORD = 'myBadPassword';

describe("Advertisement", () => {
    beforeAll(async () => {
        connection = await SqliteConnectionFactory.createClient();
        server = await FrameworkServer.start();
        await connection.execute('delete from advertisements;', [])
    })

    beforeEach(async () => {
        await connection.execute('delete from advertisements;', [])
    })

    it("Should publish an advertisement", async () => {
        const request = new FrameworkRequest(Method.POST, '/advertisement',
            { id: ID, description: DESCRIPTION, password: PASSWORD }
        )

        const response = await server.route(request)

        expect(response.statusCode).toBe(201);

        const dbData = await connection.query("SELECT * FROM advertisements") as any[]

        expect(dbData.length).toBe(1);
        expect(dbData[0].id).toBe(ID);
        expect(dbData[0].description).toBe(DESCRIPTION);
        expect(dbData[0].password).toBeDefined;
        expect(dbData[0].advertisement_date).toBeDefined;
    });


    it("Should change an advertisement", async () => {
        await withAnAdvertisementCreated()

        const request = new FrameworkRequest(Method.PUT, `/advertisements/${ID}`,
            { description: NEW_DESCRIPTION, password: PASSWORD }
        )

        const response = await server.route(request)

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeUndefined;

        const dbData = await connection.query("SELECT * FROM advertisements") as any[]

        expect(dbData.length).toBe(1);
        expect(dbData[0].description).toBe(NEW_DESCRIPTION);
        const newDate = new Date(dbData[0].advertisement_date)
        const diff = getHourDifference(newDate)
        expect(diff).toBeLessThan(1)
    })

    it("Should renew an advertisement", async () => {
        await withAnAdvertisementCreated()

        const request = new FrameworkRequest(Method.PATCH, `/advertisements/${ID}`,
            { password: PASSWORD }
        )

        const response = await server.route(request)

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeUndefined;

        const dbData = await connection.query("SELECT * FROM advertisements") as any[]

        expect(dbData.length).toBe(1);
        const newDate = new Date(dbData[0].advertisement_date)
        const diff = getHourDifference(newDate)
        expect(diff).toBeLessThan(1)
    })

    it("Should not change an advertisement with incorrect password", async () => {
        await withAnAdvertisementCreated()

        const request = new FrameworkRequest(Method.PUT, `/advertisements/${ID}`,
            { description: NEW_DESCRIPTION, password: INCORRECT_PASSWORD }
        )

        const response = await server.route(request)

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeUndefined;

        const dbData = await connection.query("SELECT * FROM advertisements") as any[]

        expect(dbData.length).toBe(1);
        expect(dbData[0].description).toBe(DESCRIPTION);
        const newDate = new Date(dbData[0].advertisement_date)
        const diff = getHourDifference(newDate)
        expect(diff).toBeGreaterThan(1)
    })

    it("Should not renew an advertisement with incorrect password", async () => {
        await withAnAdvertisementCreated()

        const request = new FrameworkRequest(Method.PATCH, `/advertisements/${ID}`,
            { password: INCORRECT_PASSWORD }
        )

        const response = await server.route(request)

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeUndefined;

        const dbData = await connection.query("SELECT * FROM advertisements") as any[]

        expect(dbData.length).toBe(1);
        expect(dbData[0].description).toBe(DESCRIPTION);
        const newDate = new Date(dbData[0].advertisement_date)
        const diff = getHourDifference(newDate)
        expect(diff).toBeGreaterThan(1)
    })

});


async function withAnAdvertisementCreated(): Promise<void> {
    await connection.execute(
        `INSERT INTO advertisements (id, description, password, advertisement_date) VALUES (?, ?, ?, ?)`,
        [
            ID,
            DESCRIPTION,
            createHash('md5').update(PASSWORD).digest('hex'),
            ADVERTISEMENT_CREATION_DATE
        ]);
}

function getHourDifference(date: Date): number {

    const currentDate = new Date();
    const differenceInMs = currentDate.getTime() - date.getTime();
    const differenceInHours = differenceInMs / (1000 * 60 * 60);
    return differenceInHours;
}
