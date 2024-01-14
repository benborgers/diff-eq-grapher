<?php

namespace App\Console;

use App\Jobs\CleanUpGraphs;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Trying to pick a time when nobody is using the app.
        $schedule->job(new CleanUpGraphs)
            ->dailyAt('4:30')
            ->timezone('America/New_York');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
