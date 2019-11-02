<?php
require("core/Main.php");
$main = new Main(false);
$database = $main->db;
$functions = $main->functions;

if(isset($_POST['mode'])) {
    switch($_POST['mode']) {
        case "jsLogin":
            loginUser();
            break;
    }
} else {
    http_response_code(403);
}

function loginUser() {
    global $database, $functions;
    $array = null;
    if(isset($_POST['userID']) && isset($_POST['token'])) {

        // Verify if what the user is saying is true
        $sessionString = $_POST['token'];
        $userID = $_POST['userID'];
        if($database->getNumberOfRows("SELECT * FROM users_sessions WHERE SessionString='{$sessionString}' AND UserID='{$userID}' AND Valid=1") > 0) {
            $_SESSION['userID'] = $userID;
            $_SESSION['token'] = $sessionString;

            $array = array(
                "valid" => true
            );
        } else {
            $array = array(
                "valid" => false,
                "message" => "User Token couldn't be verified. Please try again"
            );
        }

        echo json_encode(
            $array,
            JSON_UNESCAPED_SLASHES
        );
    } else {
        http_response_code(403);
    }
}