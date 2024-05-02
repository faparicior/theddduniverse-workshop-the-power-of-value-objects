<?php

namespace Tests\Demo\App\E2e;

use Demo\App\Framework\Database\DatabaseConnection;
use Demo\App\Framework\DependencyInjectionResolver;
use Demo\App\Framework\FrameworkRequest;
use Demo\App\Framework\FrameworkResponse;
use Demo\App\Framework\Server;
use PHPUnit\Framework\TestCase;

final class AdvertisementTest extends TestCase
{
    private const string ADVERTISEMENT_ID = '6fa00b21-2930-483e-b610-d6b0e5b19b29';
    private const string ADVERTISEMENT_CREATION_DATE = '2024-02-03 13:30:23';
    private const string DESCRIPTION = 'Dream advertisement ';
    private const string NEW_DESCRIPTION = 'Dream advertisement changed ';
    private const string PASSWORD = 'myPassword';
    private const string INCORRECT_PASSWORD = 'myBadPassword';

    private DependencyInjectionResolver $resolver;
    private Server $server;
    private DatabaseConnection $connection;


    protected function setUp(): void
    {
        $this->resolver = new DependencyInjectionResolver();
        $this->connection = $this->resolver->connection();
        $this->emptyDatabase();
        $this->server = new Server($this->resolver);
        parent::setUp();
    }

    public function testShouldPublishAnAdvertisement(): void
    {
        $request = new FrameworkRequest(
            FrameworkRequest::METHOD_POST,
            'advertisement',
            [
                'id' => self::ADVERTISEMENT_ID,
                'description' => '' . self::DESCRIPTION,
                'password' => self::PASSWORD,
            ]
        );

        $response = $this->server->route($request);
        self::assertEquals(FrameworkResponse::STATUS_CREATED, $response->statusCode());

        $resultSet = $this->connection->query('select * from advertisements;');
        self::assertEquals(self::DESCRIPTION, $resultSet[0][1]);
    }

    public function testShouldChangeAnAdvertisement(): void
    {
        $this->withAnAdvertisementCreated();

        $request = new FrameworkRequest(
            FrameworkRequest::METHOD_PUT,
            'advertisements/' . self::ADVERTISEMENT_ID,
            [
                'description' => self::NEW_DESCRIPTION,
                'password' => self::PASSWORD,
            ]
        );
        $response = $this->server->route($request);

        self::assertEmpty($response->data());

        $resultSet = $this->connection->query('select * from advertisements;');
        self::assertEquals(self::NEW_DESCRIPTION, $resultSet[0]['description']);
        $diff = date_diff(new \DateTime($resultSet[0]['advertisement_date']), new \DateTime(self::ADVERTISEMENT_CREATION_DATE));
        self::assertGreaterThan(0, $diff->days);
    }

    public function testShouldRenewAdvertisement(): void
    {
        $this->withAnAdvertisementCreated();

        $request = new FrameworkRequest(
            FrameworkRequest::METHOD_PATCH,
            'advertisements/' . self::ADVERTISEMENT_ID,
            [
                'password' => self::PASSWORD,
            ]
        );
        $response = $this->server->route($request);

        self::assertEmpty($response->data());

        $resultSet = $this->connection->query('select * from advertisements;');
        $diff = date_diff(new \DateTime($resultSet[0]['advertisement_date']), new \DateTime(self::ADVERTISEMENT_CREATION_DATE));
        self::assertGreaterThan(0, $diff->days);
    }

    public function testShouldNotChangeAnAdvertisementWithIncorrectPassword(): void
    {
        $this->withAnAdvertisementCreated();

        $request = new FrameworkRequest(
            FrameworkRequest::METHOD_PUT,
            'advertisements/' . self::ADVERTISEMENT_ID,
            [
                'id' => self::ADVERTISEMENT_ID,
                'description' => self::NEW_DESCRIPTION,
                'password' => self::INCORRECT_PASSWORD,
            ],
        );

        $response = $this->server->route($request);

        self::assertEmpty($response->data());

        $resultSet = $this->connection->query('select * from advertisements;');
        self::assertEquals(self::DESCRIPTION, $resultSet[0]['description']);
        self::assertEquals(md5(self::PASSWORD), $resultSet[0]['password']);
    }

    public function testShouldNotRenewAnAdvertisementWithIncorrectPassword(): void
    {
        $this->withAnAdvertisementCreated();

        $request = new FrameworkRequest(
            FrameworkRequest::METHOD_PATCH,
            'advertisements/' . self::ADVERTISEMENT_ID,
            [
                'password' => self::INCORRECT_PASSWORD,
            ]
        );

        $response = $this->server->route($request);

        self::assertEmpty($response->data());

        $resultSet = $this->connection->query('select * from advertisements;');
        $diff = date_diff(new \DateTime($resultSet[0]['advertisement_date']), new \DateTime(self::ADVERTISEMENT_CREATION_DATE));
        self::equalTo($diff->days);
    }

    private function emptyDatabase(): void
    {
        $this->connection->execute('delete from advertisements;');
    }

    private function withAnAdvertisementCreated(): void
    {
        $this->connection->execute(sprintf("INSERT INTO advertisements (id, description, password, advertisement_date) VALUES ('%s', '%s', '%s', '%s')",
                self::ADVERTISEMENT_ID,
                self::DESCRIPTION,
                md5(self::PASSWORD),
                self::ADVERTISEMENT_CREATION_DATE,
            )
        );
    }
}
