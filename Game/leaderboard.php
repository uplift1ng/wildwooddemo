<html>
    <meta charset="UTF-8">
    <title> Project 473 - Leaderboard</title>
    <style>
        <?php include "css/Leaderboardstyle.css" ?>
    </style>

<center>
<body>

<h1 class="form__title">  Leaderboard  </h1>
    <!-- Block that is Leaderboard Container-->
    <div class="container">
                
        <br>
        <br>
        <?php
            // This is to make the connection to the database

            require 'db.php';
            
            $query = "select * from players order by balance desc";
            $result = mysqli_query($conn,$query);
            
        ?>

        <table id="leftF" align="center" border="thin"> 
            <tr> 
                <th colspan="4"><h2>High Scores</h2></th> 
            </tr> <tr>
                    <th> ID </th> 
                    <th> Name </th> 
                    <th> High Score </th> 
                      
                </tr> 
               
                <?php

                    function displayScores($result)
                    {
                  
                       // Until there are no rows in the result set,
                       // fetch a row into the $row array and ...
                       while ($row = $result -> fetch_row())
                       {
                          // ... start a TABLE row ...
                          echo "\n<tr>";
                  
                          // ... and print out each of the attributes
                          // in that row as a separate TD (Table Data).
                          foreach($row as $data)
                             echo "\n\t<td> $data </td>";
                  
                          // Finish the row
                          echo "\n</tr>";  
                       }
                  
                       // Then, finish the table
                       echo "\n</table>\n";
                    }

                    displayScores($result);
                ?>
            
            <button id="leaderBoard" onclick="window.location.href = 'index.html';"> Back </button>

    </div> 
</body>
</center>
</html>