<?php
class ClientController
{
    public function home()
    {
        require_once 'views/home.php';
    }

    public function form()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Handle client form submission
            // Save client info and handle video upload
            header('Location: /client/thank_you');
            exit();
        }
        require_once 'views/client/form.php';
    }

    public function thankYou()
    {
        require_once 'views/client/thank_you.php';
    }
}