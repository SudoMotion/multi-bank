<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\UpdateCustomerProfileRequest;
use App\Models\Customer;
use App\Support\CustomerAccountNumber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(Request $request): Response
    {
        /** @var Customer $customer */
        $customer = $request->user('customer');

        $displayName = strtoupper($customer->fullName());

        return Inertia::render('Customer/Profile/Index', [
            'profile' => [
                'name' => $customer->fullName(),
                'display_name' => $displayName,
                'first_name' => $customer->first_name,
                'last_name' => $customer->last_name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'address' => $customer->address,
                'home_address' => $customer->address,
                'mailing_address' => $customer->address,
                'account_number' => CustomerAccountNumber::formatForDisplay($customer->accountNumber()),
                'account_number_digits' => $customer->accountNumber(),
            ],
        ]);
    }

    public function update(UpdateCustomerProfileRequest $request): RedirectResponse
    {
        /** @var Customer $customer */
        $customer = $request->user('customer');
        $section = $request->validated('section');

        $message = match ($section) {
            'address' => 'Your address has been updated.',
            'phone' => 'Your phone number has been updated.',
            'email' => 'Your email address has been updated.',
            default => 'Your profile has been updated.',
        };

        if ($section === 'address') {
            $customer->update([
                'address' => $request->validated('address'),
            ]);
        } elseif ($section === 'phone') {
            $customer->update([
                'phone' => $request->validated('phone'),
            ]);
        } elseif ($section === 'email') {
            $customer->update([
                'email' => $request->validated('email'),
            ]);
        }

        return redirect()
            ->route('customer.profile')
            ->with('success', $message);
    }
}
