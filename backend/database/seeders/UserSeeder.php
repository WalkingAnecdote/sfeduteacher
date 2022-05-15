<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roleTeacher = Role::where('name', "teacher")->firstOrFail();

        $roleStudent = Role::where('name', "student")->firstOrFail();

        $roleAdmin = Role::where('name', "admin")->firstOrFail();

        // gets all permissions via Gate::before rule; see AuthServiceProvider

        $admin = User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@admin.com',
            'password' => \Illuminate\Support\Facades\Hash::make(env('ADMIN_PASSWORD', '123123123'))
        ]);
        $admin->assignRole($roleAdmin);

        $teacher = User::factory()->create([
            'name' => 'Teacher',
            'email' => 'teacher@sfedu.com',
            'password' => \Illuminate\Support\Facades\Hash::make(env('TEACHER_PASSWORD', '123123123'))
        ]);
        $teacher->assignRole($roleTeacher);

        $student = User::factory()->create([
            'name' => 'Student',
            'email' => 'student@sfedu.com',
            'password' => \Illuminate\Support\Facades\Hash::make(env('STUDENT_PASSWORD', '123123123'))
        ]);
        $student->assignRole($roleStudent);
    }

}
