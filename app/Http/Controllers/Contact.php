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

        $emailBody = "Message from {$body['email']}:\n\n{$body['message']}";

        Mail::raw($emailBody, function ($message) use ($body) {
            $message->to('benborgers@hey.com');
            $message->subject('Differential Equation Grapher');
            $message->replyTo($body['email']);
        });

        posthog_event('contact', [
            'email' => $body['email'],
        ]);
    }
}
