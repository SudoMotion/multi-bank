<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Http\Requests\Frontend\ContactRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Frontend/Contact/Index');
    }

    public function store(ContactRequest $request): RedirectResponse
    {
        // Contact submissions can be wired to mail or a database table later.

        return redirect()
            ->route('contact')
            ->with('success', 'Thank you for your message. We will get back to you soon.');
    }
}
