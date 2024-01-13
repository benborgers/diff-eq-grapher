<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>Differential Equation Grapher</title>

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead

        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
    </head>
    <body class="font-sans antialiased text-black bg-amber-100">
        @inertia
    </body>
</html>
