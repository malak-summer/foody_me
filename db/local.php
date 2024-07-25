<?php
  $host = 'localhost';
  $user = 'root';
  $pass = '';
  $db = 'food_data';

  $con = mysqli_connect($host, $user,$pass, $db);
  if (!$con) {
    echo 'Non connect';
  }
 

?>