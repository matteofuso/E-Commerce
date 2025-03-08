<?php
class Log
{
    static function errlog(Exception $e): void{
        $err_file = $e->getFile();
        $err_line = $e->getLine();
        $directory =  dirname(__DIR__) . DIRECTORY_SEPARATOR . 'logs';
        if (!file_exists($directory)) {
            mkdir($directory, 0777, true);
        }
        $error_msg = "[" . date('Y-m-d H:i:s') . "] " . $err_file . " on line " . $err_line .": " . $e->getMessage() . "\n";
        $file = $directory . DIRECTORY_SEPARATOR. date('d-m-Y') . '.log';
        error_log($error_msg, 3, $file);
    }

}