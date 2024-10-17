<?php
return [
    '/' => 'ClientController@home',
    '/client/form' => 'ClientController@form',
    '/client/thank_you' => 'ClientController@thankYou',
    '/admin/login' => 'AdminController@login',
    '/admin/dashboard' => 'AdminController@dashboard',
    '/admin/manage_questions' => 'AdminController@manageQuestions',
    '/admin/survey_management' => 'AdminController@surveyManagement',
    '/admin/logout' => 'AdminController@logout',
];