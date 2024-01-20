<?php

namespace App\Http\Controllers;

class GraphImage extends Controller
{
    public function __invoke($id)
    {
        $path = resource_path('python/public/'.$id.'.png');

        if (! file_exists($path)) {
            abort(404);
        }

        return response(
            file_get_contents($path)
        )->header('Content-Type', 'image/png');
    }
}
