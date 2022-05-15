<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // create roles and assign existing permissions
        $roleUser = Role::create([
            'name' => 'student',
            'readable_name' => 'Студент',
            'description' => 'Роль студент'
        ]);

        // create roles and assign existing permissions
        $roleOperator = Role::create([
            'name' => 'teacher',
            'readable_name' => 'Преподаватель',
            'description' => 'Роль преподаватель',
        ]);

        $roleSuperAdmin = Role::create([
            'name' => 'admin',
            'readable_name' => 'Супер администратор',
            'description' => 'Наделен всеми правами!'
        ]);
    }

}
