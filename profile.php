<?php
require('core/Main.php');
$main = new Main();
$mainTemplate = $main->template;
$database = $main->db;
$functions = $main->functions;

if(!isset($_GET['id'])) {
    http_response_code(404);
} else {
    $profileID = $_GET['id'];
    $userData = $functions->getUserDataOnUserId($profileID);
    if($userData == false) {
        http_response_code(404);
    }
}

$themeFile = "pages/user/site.profile";

$page = new TemplateHandler($themeFile);
$page->setVariable("siteName", Configuration::siteName);

$mainTemplate->setVariable("pageName", $userData['FirstName'] . " " . $userData['LastName']);
$mainTemplate->setVariable("content", $page->getTemplate());
//$mainTemplate->appendVariable("scripts", '<script src="js/nazzer/getPosts.js" type="module"></script>');


$mainTemplate->render();