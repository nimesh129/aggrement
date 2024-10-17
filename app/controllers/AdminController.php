<?php
class AdminController {
    public function login() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Handle login logic (authentication)
            // For simplicity, assume successful login
            session_start();
            $_SESSION['admin_logged_in'] = true;
            header('Location: /admin/dashboard');
            exit();
        }
        require_once 'views/admin/login.php';
    }

    public function dashboard() {
        $this->checkAdmin();
        require_once 'views/admin/dashboard.php';
    }

    public function manageQuestions() {
        $this->checkAdmin();
        // Logic to manage questions (CRUD operations)
        require_once 'views/admin/manage_questions.php';
    }

    public function surveyManagement() {
        $this->checkAdmin();
        // Logic to manage survey responses
        require_once 'views/admin/survey_management.php';
    }

    public function logout() {
        session_start();
        session_destroy();
        header('Location: /admin/login');
        exit();
    }

    private function checkAdmin() {
        session_start();
        if (!isset($_SESSION['admin_logged_in'])) {
            header('Location: /admin/login');
            exit();
        }
    }
}