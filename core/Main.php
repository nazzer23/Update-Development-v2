<?php
// Session Management
session_start();

// Imports
require('config.php');
require('handlers/DatabaseHandler.php');
require('handlers/TemplateHandler.php');
require('handlers/Functions.php');

class Main
{

    public $template;
    public $db;
    public $functions;

    // The pages that the user can browse if in the event that they're not logged in.
    public $userLoggedOutPages;

    /**
     * Main constructor.
     * @param bool $isSite
     */
    public function __construct($isSite = true)
    {
        // Initialize Database
        $this->db = new DatabaseHandler();
        $this->preventInjection();

        // Initialize Functions
        $this->functions = new Functions($this);

        if ($isSite) {
            // Initialize Template System
            $this->template = new TemplateHandler("site.design");
            $this->setDefaultTemplateSettings();

            $this->initializePageBlackList();
            if ($this->functions->VerifyUserSession()) {
                if (in_array(basename($_SERVER['PHP_SELF'], '.php'), $this->userLoggedOutPages)) {
                    header('Location: /');
                }
                $this->initiateUserNavbar();
            } else {
                if (!in_array(basename($_SERVER['PHP_SELF'], '.php'), $this->userLoggedOutPages)) {
                    header('Location: /login.php');
                }
            }
        }

    }

    public function initializePageBlackList()
    {
        $this->userLoggedOutPages = array("login", "register");
    }

    private function initiateUserNavbar()
    {
        $currentUser = $this->functions->getUserDataForCurrentUser();
        $navbarTemplate = new TemplateHandler("site.navbar");

        // Set Template Arguments
        $navbarTemplate->setVariable("userFirstName", $currentUser['FirstName']);
        $navbarTemplate->setVariable("currentUserID", $currentUser['UserID']);
        $navbarTemplate->setVariable("userProfilePicture", $this->functions->getUserProfilePicture(currentUser['UserID']));

        $this->template->appendVariable("navbar", $navbarTemplate->getTemplate());
        $this->template->appendVariable("scripts", '<script src="js/nazzer/navbarContent.js" type="module"></script>');
    }

    /**
     *
     */
    private function preventInjection()
    {
        $_POST = $this->db->escapeArray($_POST);
        $_GET = $this->db->escapeArray($_GET);
    }

    /**
     *
     */
    private function setDefaultTemplateSettings()
    {
        $this->template->setVariable("author", Configuration::authorName);
        $this->template->setVariable("currentYear", date("Y"));
        $this->template->setVariable("siteName", Configuration::siteName);

        // Update Specific Template Values
        $this->template->setVariable("scripts", "");
        $this->template->setVariable("navbar", "");
        $this->template->setVariable("modals", "");

    }
}