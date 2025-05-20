<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->unsignedBigInteger('opencritic_id')->nullable()->after('id');
            $table->boolean('data_completed')->default(false)->after('opencritic_id');
            $table->boolean('reviews_imported')->default(false)->after('data_completed');
        });
    }

    public function down(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn(['opencritic_id', 'data_completed', 'reviews_imported']);
        });
    }
};
