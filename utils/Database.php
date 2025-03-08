<?php
include_once 'Log.php';
class Database
{
    private static ?PDO $PDO = null;
    private static bool $connectionFailed = false;

    public static function select(string $query, array $bind = []): array
    {
        if (self::$PDO === null) {
            throw new Exception('Database is not connected');
        }
        $stm = self::$PDO->prepare($query);
        foreach ($bind as $key => $value) {
            $stm->bindValue($key, $value);
        }
        $stm->execute();
        return $stm->fetchAll();
    }

    public static function connect(array $config, bool $reconnect = false): ?PDO
    {
        if (empty(self::$PDO)) {
            if (!self::$connectionFailed || $reconnect) {
                try {
                    self::$PDO = new PDO(
                        "$config[driver]:host=$config[host];dbname=$config[dbname]",
                        $config['user'],
                        $config['password'], [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ,
                    ]);
                } catch (PDOException $e) {
                    self::$connectionFailed = true;
                    Log::errlog($e);
                }
            }
        }
        return self::$PDO;
    }

    public static function isConnected(): bool
    {
        return self::$PDO !== null;
    }

    public static function query(string $query, array $bind = []): void
    {
        if (self::$PDO === null) {
            throw new Exception('Database is not connected');
        }
        $stm = self::$PDO->prepare($query);
        foreach ($bind as $key => $value) {
            $stm->bindValue($key, $value);
        }
        $stm->execute();
    }
}