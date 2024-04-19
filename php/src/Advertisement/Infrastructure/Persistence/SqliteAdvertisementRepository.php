<?php
declare(strict_types=1);

namespace Demo\App\Advertisement\Infrastructure\Persistence;

use Demo\App\Advertisement\Domain\AdvertisementRepository;
use Demo\App\Advertisement\Domain\Model\Advertisement;
use Demo\App\Framework\Database\DatabaseConnection;
use Demo\App\Framework\database\SqliteConnection;
use Exception;

class SqliteAdvertisementRepository implements AdvertisementRepository
{
    private DatabaseConnection $dbConnection;
    public function __construct(SqliteConnection $connection)
    {
        $this->dbConnection = $connection;
    }

    public function save(Advertisement $advertisement): void
    {
        $this->dbConnection->execute(sprintf('
            INSERT INTO advertisements (id, description, password) VALUES (\'%1$s\', \'%2$s\', \'%3$s\') 
            ON CONFLICT(id) DO UPDATE SET description = \'%2$s\', password = \'%3$s\';',
                $advertisement->id(),
                $advertisement->description(),
                md5($advertisement->password()),
            )
        );
    }

    /**
     * @throws Exception
     */
    public function findById(string $id): Advertisement
    {
        $result = $this->dbConnection->query(sprintf('SELECT * FROM advertisements WHERE id = \'%s\'', $id));
        if(!$result) {
            throw new Exception('Advertisement not found');
        }
        $row = $result[0];
        return new Advertisement($row['id'], $row['description'], $row['password']);
    }
}
