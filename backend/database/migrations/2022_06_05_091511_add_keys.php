<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table("semesters", function (Blueprint $table) {
            $table->foreign('group_id')
                ->references('id')
                ->on("groups")
                ->onDelete('cascade');
        });
        Schema::table("subjects", function (Blueprint $table) {
            $table->foreign('teacher_id')
                ->references('id')
                ->on("teacher_profiles");
        });
        Schema::table("semester_subject", function (Blueprint $table) {
            $table->foreign('semester_id')
                ->references('id')
                ->on("semesters");

            $table->foreign('subject_id')
                ->references('id')
                ->on("subjects");
        });
        Schema::table("lessons", function (Blueprint $table) {
            $table->foreign('subject_id')
                ->references('id')
                ->on("subjects")
                ->onDelete('cascade');
        });
        Schema::table("marks", function (Blueprint $table) {
            $table->foreign('activity_id')
                ->references('id')
                ->on("activities")
                ->onDelete('cascade');
        });
        Schema::table("tests", function (Blueprint $table) {
            $table->foreign('activity_id')
                ->references('id')
                ->on("activities")
                ->onDelete('cascade');
        });
        Schema::table("tasks", function (Blueprint $table) {
            $table->foreign('test_id')
                ->references('id')
                ->on("tests")
                ->onDelete('cascade');
        });
        Schema::table("questions", function (Blueprint $table) {
            $table->foreign('task_id')
                ->references('id')
                ->on("tasks")
                ->onDelete('cascade');
        });
        Schema::table("messages", function (Blueprint $table) {
            $table->foreign('chat_id')
                ->references('id')
                ->on("chats")
                ->onDelete('cascade');
        });
        Schema::table("test_results", function (Blueprint $table) {
            $table->foreign('test_id')
                ->references('id')
                ->on("tests")
                ->onDelete('cascade');
        });
        Schema::table("test_results", function (Blueprint $table) {
            $table->foreign('student_id')
                ->references('id')
                ->on("student_profiles")
                ->onDelete('cascade');
        });
        Schema::table("lesson_activity", function (Blueprint $table) {
            $table->foreign('lesson_id')
                ->references('id')
                ->on("lessons")
                ->onDelete('cascade');
            $table->foreign('activity_id')
                ->references('id')
                ->on("activities")
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};
