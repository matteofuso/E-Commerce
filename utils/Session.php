<?php
require_once 'Database.php';
require_once 'Log.php';
require_once 'Token.php';

class Session
{
    public static function start($db_config)
    {
        if (session_status() != PHP_SESSION_NONE){
            return true;
        }

        session_start([
            "name" => "EASessID",
            "sid_length" => 128,
            "sid_bits_per_character" => 6,
        ]);

        if (isset($_SESSION['id']) || empty($db_config)) {
            return true;
        }

        if (!isset($_COOKIE['AEToken'])) {
            $token = Token::generate();
            setcookie('AEToken', $token, strtotime('+1 year'), '/');
            return true;
        }

        if (!Database::connect($db_config)){
            return False;
        }

        try {
            $tokens = Database::select("select * from token t where t.token = :token", [
                ':token' => $_COOKIE['AEToken'] ?? null
            ]);

            if (count($tokens) > 0){
                if (!empty($tokens[0]->utente)){
                    $user = Database::select("select * from utenti u where u.id = :id", [
                        ':id' => $tokens[0]->utente
                    ]);

                    self::loadUser($user[0]);
                }
            }
        } catch (Exception $e) {
            Log::errlog($e);
            return False;
        }
        return True;
    }

    public static function loadUser($user){
        $_SESSION['id'] = $user->id;
        $_SESSION['nome'] = $user->nome;
        $_SESSION['cognome'] = $user->cognome;
        $_SESSION['email'] = $user->email;
    }

    public static function remember(){
        if (!isset($_SESSION['id'])) {
            return False;
        }

        try {
            $tokens = Database::select("select * from token where token = :token", [
                ':token' => $_COOKIE['AEToken']
            ]);

            if (count($tokens) > 0){
                Database::query("update token set utente = :utente where token = :token", [
                    ':utente' => $_SESSION['id'],
                    ':token' => $_COOKIE['AEToken']
                ]);
                $_SESSION['token_id'] = $tokens[0]->id;
                return True;
            }

            Database::query("insert into token (token, utente) values (:token, :utente)", [
                ':token' => $_COOKIE['AEToken'],
                ':utente' => $_SESSION['id']
            ]);
            $_SESSION['token_id'] = Database::connect()->lastInsertId();
        } catch (Exception $e) {
            Log::errlog($e);
            return False;
        }

        return True;
    }

    public static function destroy()
    {
        session_unset();
        session_destroy();
        setcookie('AEToken', '', time() - 3600, '/');
        try {
            Database::query("delete from token where id = :id", [
                ':id' => $_SESSION['token_id']
            ]);
        } catch (Exception $e) {
            Log::errlog($e);
        }
    }
}