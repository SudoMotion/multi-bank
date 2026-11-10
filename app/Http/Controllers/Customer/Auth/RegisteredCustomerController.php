<?php

namespace App\Http\Controllers\Customer\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\RegisterRequest;
use App\Models\Customer;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredCustomerController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Customer/Auth/Register');
    }

    public function store(RegisterRequest $request): RedirectResponse
    {
        $customer = Customer::create($request->customerAttributes());

        event(new Registered($customer));

        Auth::guard('customer')->login($customer);

        $request->session()->regenerate();

        return redirect()->route('customer.dashboard');
    }
}
