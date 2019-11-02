<?php
require('core/Main.php');
$main = new Main();
$mainTemplate = $main->template;
$database = $main->db;
$functions = $main->functions;

$themeFile = "site.login";

$page = new TemplateHandler($themeFile);
$page->setVariable("siteName", Configuration::siteName);

$mainTemplate->setVariable("pageName", "Login");
$mainTemplate->appendVariable("scripts", '<script src="js/nazzer/login.js" type="module"></script>');
$mainTemplate->appendVariable("scripts", '<link href="css/signin.css" rel="stylesheet"/>');
$mainTemplate->setVariable("content", $page->getTemplate());

$mainTemplate->render();