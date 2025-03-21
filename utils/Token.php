<?php
include_once 'Database.php';

class Token
{
    public static function generate($len = 64)
    {
        return bin2hex(random_bytes($len));
    }

    public static function fetchDatabase($db_config, $token, $insert = true)
    {
        if (Database::connect($db_config) == null) {
            return null;
        }

        try {
            $tid = Database::select("select t.id from token t where t.token = :token", [
                'token' => $token
            ]);

            if (count($tid) == 0) {
                if (!$insert) {
                    return -1;
                }

                Database::query("insert into token (token) values (:token)", [
                    'token' => $token
                ]);
                $tid = Database::connect()->lastInsertId();
            } else {
                $tid = $tid[0]->id;
            }
        } catch (Exception $e) {
            Log::errlog($e);
            return null;
        }
        return $tid;
    }
}