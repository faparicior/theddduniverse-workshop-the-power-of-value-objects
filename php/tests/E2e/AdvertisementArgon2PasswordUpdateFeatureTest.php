<?php

namespace Tests\Demo\App\E2e;

use Demo\App\Framework\Database\DatabaseConnection;
use Demo\App\Framework\DependencyInjectionResolver;
use Demo\App\Framework\FrameworkRequest;
use Demo\App\Framework\FrameworkResponse;
use Demo\App\Framework\Server;
use PHPUnit\Framework\TestCase;

final class AdvertisementArgon2PasswordUpdateFeatureTest extends TestCase
{
    private const string FLAT_ID = '6fa00b21-2930-483e-b610-d6b0e5b19b29';
    private const string ADVERTISEMENT_CREATION_DATE = '2024-02-03 13:30:23';

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

    ////////////////////////////////////////////////////////////
    // Use this help
    // https://www.php.net/manual/es/function.password-hash.php

    public function testShouldPublishAnAdvertisementWithArgon2Password(): void
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

        $resultSet = $this->connection->query('select * from advertisements;');
        $this->expectHasAnArgon2Password($resultSet[0]['password']);
    }

    public function testShouldChangeToArgon2PasswordUpdatingAnAdvertisement(): void
    {
        $this->withAnAdvertisementWithAMd5PasswordCreated();

        $request = new FrameworkRequest(
            FrameworkRequest::METHOD_PUT,
            'advertisements/' . self::FLAT_ID,
            [
                'description' => 'Dream advertisement changed ',
                'password' => 'myPassword',
            ],
        );

        $response = $this->server->route($request);

        self::assertEmpty($response->data());

        $resultSet = $this->connection->query('select * from advertisements;');
        $this->expectHasAnArgon2Password($resultSet[0]['password']);
    }

    public function testShouldChangeToArgon2PasswordRenewingAnAdvertisement(): void
    {
        $this->withAnAdvertisementWithAMd5PasswordCreated();

        $request = new FrameworkRequest(
            FrameworkRequest::METHOD_PATCH,
            'advertisements/' . self::FLAT_ID,
            [
                'password' => 'myPassword',
            ],
        );

        $response = $this->server->route($request);

        self::assertEmpty($response->data());

        $resultSet = $this->connection->query('select * from advertisements;');
        $this->expectHasAnArgon2Password($resultSet[0]['password']);
    }

    private function emptyDatabase(): void
    {
        $this->connection->execute('delete from advertisements;');
    }

    private function withAnAdvertisementWithAMd5PasswordCreated(): void
    {
        $this->connection->execute(sprintf("INSERT INTO advertisements (id, description, password, advertisement_date) VALUES ('%s', '%s', '%s', '%s')",
                self::FLAT_ID,
                'Dream advertisement ',
                md5('myPassword'),
                self::ADVERTISEMENT_CREATION_DATE,
            )
        );
    }

    private function expectHasAnArgon2Password($password): void
    {
        self::assertStringStartsWith('$argon2i$', $password);
    }
}
