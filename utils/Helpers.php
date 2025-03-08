<?php
class Helpers
{
    public static function printTable(array $headings, array $stdArray, array $buttonCallbacks = []): void
    {
        echo '<div class="control-overflow"><table class="table table-hover table-bordered table-striped">';
        echo '<tr>';
        foreach ($headings as $heading) {
            echo '<th>' . $heading . '</th>';
        }
        echo '</tr>';
        foreach ($stdArray as $row) {
            echo "<tr>";
            foreach ($row as $value) {
                echo '<td>' . $value . '</td>';
            }
            if ($buttonCallbacks) {
                echo '<td class="table-fit">';
                foreach ($buttonCallbacks as $callback) {
                    echo $callback($row);
                }
                echo '</td>';
            }
            echo '</tr>';
        }
        echo '</table></div>' . PHP_EOL;
    }
}