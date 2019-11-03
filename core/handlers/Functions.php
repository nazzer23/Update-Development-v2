<?php

class Functions
{
    private $global;
    private $database;

    public function __construct($global)
    {
        $this->global = $global;
        $this->database = $global->db;
    }

    public function urlClean($string)
    {
        $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.
        return strtolower(preg_replace('/[^A-Za-z0-9\-]/', '', $string)); // Removes special chars.
    }

    /**
     * Checks to see if there is a valid session
     */
    public function VerifyUserSession() {
        if(isset($_SESSION['token']) && isset($_SESSION['userID'])) {
            // Validate User Session
            $sessionString = $_SESSION['token'];
            $userID = $_SESSION['userID'];
            if($this->database->getNumberOfRows("SELECT * FROM users_sessions WHERE SessionString='{$sessionString}' AND UserID='{$userID}' AND Valid=1") > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public function VerifyUserSessionOnToken($userID, $sessionString) {
        if(isset($userID) && isset($sessionString)) {
            // Validate User Session
            if($this->database->getNumberOfRows("SELECT * FROM users_sessions WHERE SessionString='{$sessionString}' AND UserID='{$userID}' AND Valid=1") > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public function getUserDataForCurrentUser() {
        if(!isset($_SESSION['userID'])) {
            return false;
        } else {
            return $this->getUserDataOnUserId($_SESSION['userID']);
        }
    }

    public function getUserDataOnUserId($userID) {
        if(!is_numeric($userID)) {
            return false;
        }
        if($userID > 0) {
            $userQuery = "SELECT * FROM users WHERE UserID = '{$userID}'";
            $userQuery = $this->database->executeQuery($userQuery);
            if($userQuery->num_rows > 0) {
                return $userQuery->fetch_array();
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public function getUserProfilePicture($userID) {
        return "https://www.wbrc.com/resizer/ZBOPYrOOggKobpvrrIrfClObKaI=/1400x0/arc-anglerfish-arc2-prod-raycom.s3.amazonaws.com/public/BV7IA24BUZBBRCKTJE5XP6KPPQ.jpg";
    }

    public function getDateFormat($date) {
        $databaseTime = strtotime($date);
        return date("l jS F Y g:ia", $databaseTime);
    }
}