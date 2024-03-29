<?php

namespace Tests\Demo\App\e2e;

use Demo\App\framework\DependencyInjectionResolver;
use Demo\App\framework\FrameworkRequest;
use Demo\App\framework\FrameworkResponse;
use Demo\App\framework\Server;
use PHPUnit\Framework\TestCase;

final class AdvertisementTest extends TestCase
{
    private const string FLAT_ID = '6fa00b21-2930-483e-b610-d6b0e5b19b29';
    private DependencyInjectionResolver $resolver;
    private Server $server;
    private \PDO $connection;


    protected function setUp(): void
    {
        $this->resolver = new DependencyInjectionResolver();
        $this->connection = $this->resolver->connection()->connect();
        $this->emptyDatabase();
        $this->server = new Server($this->resolver);
        parent::setUp();
    }

    public function testShouldCreateAnAdvertisement(): void
    {
        $request = new FrameworkRequest(
            FrameworkRequest::METHOD_POST,
            'advertisement',
            [
                'id' => self::FLAT_ID,
                'description' => 'Dream advertisement ',
                'password' => 'myPassword',
            ]
        );

        $response = $this->server->route($request);
        self::assertEquals(FrameworkResponse::STATUS_CREATED, $response->statusCode());

        $resultSet = $this->connection->query('select * from advertisements;')->fetchAll();
        self::assertEquals('Dream advertisement ', $resultSet[0][1]);
    }

    public function testShouldChangeAnAdvertisement(): void
    {
        $this->withAnAdvertisementCreated();

        $request = new FrameworkRequest(
            FrameworkRequest::METHOD_POST,
            'advertisement' . self::FLAT_ID,
            [
                'description' => 'Dream advertisement changed ',
                'password' => 'myPassword',
            ]
        );
        $response = $this->server->route($request);

        self::assertEmpty($response->data());

        $resultSet = $this->connection->query('select * from advertisements;')->fetchAll();
        self::assertEquals('Dream advertisement changed ', $resultSet[0]['description']);
    }

    public function testShouldRenewAdvertisement(): void
    {
        $this->withAnAdvertisementCreated();

        $request = new FrameworkRequest(
            FrameworkRequest::METHOD_POST,
            'advertisement' . self::FLAT_ID,
            [
                'password' => 'myPassword',
            ]
        );
        $response = $this->server->route($request);

        self::assertEmpty($response->data());

        $resultSet = $this->connection->query('select * from advertisements;')->fetchAll();
        self::assertEquals(1, $resultSet[0]['renew_count']);
    }

    private function emptyDatabase(): void
    {
        $this->connection->exec('delete from advertisements;');
    }

    private function withAnAdvertisementCreated(): void
    {
        $this->connection->exec(sprintf("INSERT INTO advertisements (id, description, password) VALUES ('%s', '%s', '%s')",
                self::FLAT_ID,
                'Dream advertisement ',
                md5('myPassword')
            )
        );
    }
}
