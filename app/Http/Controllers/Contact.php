<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class Contact extends Controller
{
    public function __invoke(Request $request)
    {
        $body = $request->validate([
            'email' => 'required|email',
            'message' => 'required|string',
        ]);

        $body = "Message from {$body['email']}:\n\n{$body['message']}";

        Mail::raw($body, function ($message) {
            $message->to('benjamin.borgers@tufts.edu');
            $message->subject('Differential Equation Grapher');
        });
    }
}
