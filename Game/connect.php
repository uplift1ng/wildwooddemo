<?php
    require 'db.php';
    print_r($_POST);
    // Grab name variable form form
    if($_POST["name"] == NULL){
        $name1 = "GUEST";
    }else{
        $name1 = $_POST["name"];
    }
    
    $playername = filter_var($name1,FILTER_SANITIZE_STRING);
    echo $playername;
    $score = $_POST["inputScore"];
 
    $sql = "SELECT * FROM players WHERE name='$playername'";
    $result = $conn->query($sql);
    
   
    // if username does not exist, create new. Else, log in with user.
   if(mysqli_num_rows($result) == 0){
  
        echo 'new user. inserted.';
        $sql = "INSERT INTO players(name,balance) VALUES('$playername',$score)";
        $conn->query($sql);
    }else{ 
        $currentBal = 0;
        $sql = "SELECT balance from players where name = '$playername'";
        $result = $conn->query($sql);
        while ($row = $result -> fetch_row())
        {
            foreach($row as $data)
            $currentBal = $data;
        }
        echo  $currentBal;
        if($score > $currentBal){
            echo 'greater';
            $sql = "UPDATE players SET balance = $score WHERE name = '$playername'";
            $conn->query($sql);
        }else{
            echo 'not greater';
        }
        echo 'its there.';
        
    }
    
    $conn -> close();

    header('Location: index.html');
    
?>