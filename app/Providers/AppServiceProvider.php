<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use PostHog\PostHog;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (config('services.posthog.key')) {
            PostHog::init(config('services.posthog.key'), [
                'host' => 'https://app.posthog.com',
            ]);
        }
    }
}
