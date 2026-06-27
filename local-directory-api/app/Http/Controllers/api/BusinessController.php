<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Models\Business;

class BusinessController extends Controller
{
    //
    public function store(Request $data){
        $validated = $data->validate([
            'businessName' => 'required|string|max:100',
            'category' => 'required|string|max:100',
            'description' => 'required|string|max:550',
            'streetAddress' => 'required|string|max:100',
            'parish' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'about' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email'=> 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
        ]);

        $validated['slug'] = Str::slug($validated['businessName']);
        $validated['user_id'] = Auth::id();
        $validated['featured'] = false;
        $validated['verified'] = false;
        $validated['rating'] = 0;
        $validated['reviewCount'] = 0;

        $business = Business::create($validated);

        return response()->json([
            'message' => 'Business created successfully.',
            'business' => $business
        ], 201);
    }

    public function myBusinesses(Request $request)
    {
        $businesses = Business::where('user_id', Auth::id())->get();
        return response()->json($businesses);
    }

    public function index(Request $request)
    {
        $businesses = Business::all();
        return response()->json($businesses);
    }
}
