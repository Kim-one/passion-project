<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Business extends Model
{
    //
    protected $fillable = [
        'user_id',
        'slug',
        'businessName',
        'category',
        'city',
        'parish',
        'streetAddress',
        'description',
        'about',
        'phone',
        'email',
        'website',
        'heroImage',
        'featured',
        'verified',
        'rating',
        'reviewCount'
    ];

    protected $casts = [
        'rating' => 'float',
        'featured' => 'boolean',
        'verified' => 'boolean',
        'reviewCount' => 'integer'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
