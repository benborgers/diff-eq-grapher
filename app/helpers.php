<?php

use PostHog\PostHog;

function posthog_event($event, $properties = [])
{
    if (app()->isLocal()) {
        return;
    }

    PostHog::capture([
        'distinctId' => session()->getId(),
        'event' => $event,
        'properties' => $properties,
    ]);
}
