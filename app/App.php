<?php
class App
{
    private $routes;

    public function __construct()
    {
        $this->routes = include_once 'routes.php';
    }

    public function run()
    {
        $uri = trim($_SERVER['REQUEST_URI'], '/');
        foreach ($this->routes as $route => $controller) {
            if ($uri === trim($route, '/')) {
                list($controllerName, $method) = explode('@', $controller);
                $controllerInstance = new $controllerName();
                $controllerInstance->$method();
                return;
            }
        }
        http_response_code(404);
        echo 'Page not found';
    }
}