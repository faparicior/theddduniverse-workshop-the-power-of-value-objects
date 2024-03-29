<?php
declare(strict_types=1);

namespace Demo\App\Controllers;

use Demo\App\Advertisement\Domain\Model\Advertisement;
use Demo\App\framework\database\DatabaseConnection;
use Demo\App\framework\FrameworkRequest;
use Demo\App\framework\FrameworkResponse;

final readonly class AdvertisementController
{
    public function __construct(private DatabaseConnection $connection)
    {
    }

    public function changeAdvertisement(FrameworkRequest $request): FrameworkResponse
    {
        $pdo = $this->connection->connect();

        $result = $pdo->query(sprintf("SELECT * FROM advertisements WHERE id = '%s';",
            ($request->content())['id']
        ))->fetchAll();

        $advertisement = new Advertisement(
            $result[0]['id'],
            $result[0]['description'],
            $result[0]['password'],
        );

        if ($advertisement->password() !== md5(($request->content())['password'])) {
            return new FrameworkResponse([]);
        }

        $advertisement->changeDescription(($request->content())['description']);
        $advertisement->changePassword(($request->content())['password']);

        $pdo->exec(sprintf("UPDATE advertisements SET description = '%s', password = '%s' WHERE id = '%s';",
                $advertisement->description(),
                md5($advertisement->password()),
                $advertisement->id(),
            )
        );

        return new FrameworkResponse([]);
    }
}
