<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SampleController extends Controller
{
    public $course = "BSIT";
    public function index()
    {
        
        $student = 'Ralph';
        $message = "Hello, World!, $student";

        return response()->json([
            'student' => $student,
            'message' => $message,
            'course' => $this->course,
        ]);
    }
    public function read()
    {   $greetingsName = $this->greet('Ralph');

        return response()->json([
        'course' => $this->course,
        'greetings' => $greetingsName,
        ]);
    }
    public function greet($name)
    {
        return response()->json([
            'message' => "Hello, $name!",
        ]);
    }
}