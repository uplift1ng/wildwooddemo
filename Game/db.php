<?php
    $servername = "localhost";
    $username = "snyders";
    $password = "JifPeanutButter";
    $dbname = "proj473";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn -> connect_error){
        echo '<script> console.log("Connection Error"); </script>';
        exit();

    }else{
        echo '<script> console.log("Connection Successful"); </script>';
    }
?>