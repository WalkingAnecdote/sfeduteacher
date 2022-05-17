<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Laravel\Passport\Passport;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        if (! $this->app->routesAreCached()) {
            Passport::routes();
        }

        Passport::tokensExpireIn(now()->addMinutes(config('passport.tokens_lifetime.minutes_for_access')));
        Passport::refreshTokensExpireIn(now()->addDays(config('passport.tokens_lifetime.days_for_refresh')));

        Passport::tokensCan([
            'admin' => 'Admin User Type',
            'teacher' => "Teacher user type",
            'student' => "Student user type",
        ]);
    }
}
