<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::table('reviews', function (Blueprint $table) {
        $table->string('user_name')->after('score');
        $table->string('user_profile')->after('user_name');
    });
}

public function down()
{
    Schema::table('reviews', function (Blueprint $table) {
        $table->dropColumn(['user_name', 'user_profile']);
    });
}

};
