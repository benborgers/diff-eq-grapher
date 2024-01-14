<?php

namespace App\Http\Controllers;

class GraphImage extends Controller
{
    public function __invoke($id)
    {
        return response(
            file_get_contents(resource_path('python/'.$id.'.png'))
        )->header('Content-Type', 'image/png');
    }
}
