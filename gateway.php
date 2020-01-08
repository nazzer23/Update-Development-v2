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
        case "constructPost":
            constructPost();
            break;
        default:
            http_response_code(403);
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

function constructPost() {
    global $main, $database, $functions;
    if(isset($_POST['userID']) && isset($_POST['token'])) {
        if($functions->VerifyUserSessionOnToken($_POST['userID'], $_POST['token'])) {
            $queryRaw = "SELECT users_posts.*, users.FirstName, users.LastName FROM users_posts INNER JOIN users ON users_posts.UserID = users.UserID WHERE users_posts.PostID='{$_POST['postID']}' ORDER BY PostID DESC";

            $query = $database->executeQuery($queryRaw);
            while($row = $query->fetch_array()) {
                // Desktop
                $desktopTemplate = new TemplateHandler("components/posts/template.post.desktop");
                $desktopTemplate->setVariable("profileNameFirst", $row['FirstName']);
                $desktopTemplate->setVariable("profileNameLast", $row['LastName']);
                $desktopTemplate->setVariable("profileID", $row['UserID']);
                $desktopTemplate->setVariable("profilePic", $functions->getUserProfilePicture($row['UserID']));

                $desktopTemplate->setVariable("postContent", $row['Content']);
                $desktopTemplate->setVariable("postDate", $functions->getDateFormat($row['Date']));
                echo $desktopTemplate->getTemplate();

                // Mobile
                $mobileTemplate = new TemplateHandler("components/posts/template.post.mobile");
                $mobileTemplate->setVariable("profileNameFirst", $row['FirstName']);
                $mobileTemplate->setVariable("profileNameLast", $row['LastName']);
                $mobileTemplate->setVariable("profileID", $row['UserID']);
                $mobileTemplate->setVariable("profilePic", $functions->getUserProfilePicture($row['UserID']));

                $mobileTemplate->setVariable("postContent", $row['Content']);
                $mobileTemplate->setVariable("postDate", $functions->getDateFormat($row['Date']));
                echo $mobileTemplate->getTemplate();
            }

        } else {
            http_response_code(403);
        }
    } else {
        http_response_code(403);
    }
}