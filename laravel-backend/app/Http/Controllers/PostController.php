<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PostController extends Controller
{
    public function index()
    {
        $posts = [];

        foreach (Post::with('user')->latest()->get() as $post) {
            /** @var Post $post */
            $posts[] = $this->formatPost($post);
        }

        return response()->json([
            'status' => true,
            'data' => $posts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $user = User::first();

        if (!$user) {
            $user = User::create([
                'name' => 'Guest User',
                'email' => 'guest@example.com',
                'password' => Hash::make(str()->random(32)),
            ]);
        }

        $post = Post::create([
            'post' => $validated['message'],
            'description' => $validated['message'],
            'status' => 'published',
            'user_id' => $user->id,
        ]);

        $post->load('user');

        return response()->json([
            'status' => true,
            'data' => $this->formatPost($post),
        ], 201);
    }

    private function formatPost(Post $post): array
    {
        return [
            'id' => $post->id,
            'message' => $post->post,
            'created_at' => $post->created_at,
            'user' => [
                'name' => 'Guest User',
            ],
        ];
    }
}
