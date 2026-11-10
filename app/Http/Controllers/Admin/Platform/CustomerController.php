<?php

namespace App\Http\Controllers\Admin\Platform;

use App\Http\Requests\Admin\Platform\CustomerRequest;
use App\Http\Requests\Admin\Platform\UpdateCustomerPasswordRequest;
use App\Models\Account;
use App\Models\Customer;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Response;

class CustomerController extends BankWorkspaceController
{
    public function index(Request $request, Tenant $tenant): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::in(array_keys(Customer::STATUSES))],
        ]);

        $customers = $this->inBank($tenant, fn () => Customer::query()
            ->search($filters['search'] ?? null)
            ->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->withCount('accounts')
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Customer $customer) => [
                'id' => $customer->id,
                'account_number' => $customer->accountNumber(),
                'name' => $customer->fullName(),
                'email' => $customer->email,
                'phone' => $customer->phone,
                'status' => $customer->status,
                'accounts_count' => $customer->accounts_count,
                'created_at' => $customer->created_at?->format('M j, Y'),
            ]));

        return $this->render($tenant, 'customers', 'Admin/Platform/Banks/Customers/Index', [
            'customers' => $customers,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'status' => $filters['status'] ?? '',
            ],
            'statuses' => $this->options(Customer::STATUSES),
            'can' => $this->abilities($request),
        ]);
    }

    public function create(Tenant $tenant): Response
    {
        return $this->render($tenant, 'customers', 'Admin/Platform/Banks/Customers/Create', [
            'statuses' => $this->options(Customer::STATUSES),
        ]);
    }

    public function store(CustomerRequest $request, Tenant $tenant): RedirectResponse
    {
        $customer = $this->inBank($tenant, fn () => Customer::create($request->customerAttributes()));

        return redirect()
            ->route('admin.platform.banks.customers.show', [$tenant, $customer->id])
            ->with('success', "Customer {$customer->fullName()} created.");
    }

    public function show(Request $request, Tenant $tenant, int $customer): Response
    {
        $props = $this->inBank($tenant, function () use ($customer) {
            $model = Customer::query()->with(['accounts' => fn ($query) => $query->orderBy('id')])->findOrFail($customer);

            return [
                'customer' => [
                    ...$this->present($model),
                    'accounts' => $model->accounts->map(fn (Account $account) => [
                        'id' => $account->id,
                        'label' => $account->label(),
                        'type' => Account::TYPES[$account->type] ?? $account->type,
                        'status' => $account->status,
                        'balance' => $this->money($account->balance, $account->currency),
                        'opened_at' => $account->opened_at?->format('M j, Y'),
                    ])->all(),
                ],
            ];
        });

        return $this->render($tenant, 'customers', 'Admin/Platform/Banks/Customers/Show', [
            ...$props,
            'can' => $this->abilities($request),
        ]);
    }

    public function edit(Tenant $tenant, int $customer): Response
    {
        $props = $this->inBank($tenant, function () use ($customer) {
            $model = Customer::query()->with('accounts')->findOrFail($customer);

            return [
                'customer' => [
                    ...$this->present($model),
                    'account_ids' => $model->accounts->pluck('id')->all(),
                ],
                'accountOptions' => Account::query()
                    ->where(function ($query) use ($model) {
                        $query->whereNull('customer_id')
                            ->orWhere('customer_id', $model->id);
                    })
                    ->orderBy('name')
                    ->orderBy('id')
                    ->get()
                    ->map(fn (Account $account) => [
                        'id' => $account->id,
                        'label' => $account->label(),
                        'status' => $account->status,
                    ])
                    ->all(),
            ];
        });

        return $this->render($tenant, 'customers', 'Admin/Platform/Banks/Customers/Edit', [
            ...$props,
            'statuses' => $this->options(Customer::STATUSES),
        ]);
    }

    public function update(CustomerRequest $request, Tenant $tenant, int $customer): RedirectResponse
    {
        $model = $this->inBank($tenant, function () use ($request, $customer) {
            $model = Customer::query()->findOrFail($customer);
            $model->update($request->customerAttributes());
            $this->syncCustomerAccounts($model, $request->validated('account_ids', []));

            return $model;
        });

        return redirect()
            ->route('admin.platform.banks.customers.show', [$tenant, $model->id])
            ->with('success', 'Customer updated.');
    }

    public function updatePassword(UpdateCustomerPasswordRequest $request, Tenant $tenant, int $customer): RedirectResponse
    {
        $name = $this->inBank($tenant, function () use ($request, $customer) {
            $model = Customer::query()->findOrFail($customer);
            $model->forceFill(['password' => $request->validated('password')])->save();

            return $model->fullName();
        });

        return back()->with('success', "Password updated for {$name}.");
    }

    public function destroy(Tenant $tenant, int $customer): RedirectResponse
    {
        $result = $this->inBank($tenant, function () use ($customer) {
            $model = Customer::query()->withCount('accounts')->findOrFail($customer);

            if ($model->accounts_count > 0) {
                return ['error' => "{$model->fullName()} still has accounts. Close and remove them first."];
            }

            $model->delete();

            return ['success' => "Customer {$model->fullName()} deleted."];
        });

        if (isset($result['error'])) {
            return back()->with('error', $result['error']);
        }

        return redirect()
            ->route('admin.platform.banks.customers.index', $tenant)
            ->with('success', $result['success']);
    }

    /**
     * @param  list<int|string|null>  $accountIds
     */
    private function syncCustomerAccounts(Customer $customer, array $accountIds): void
    {
        $accountIds = collect($accountIds)
            ->map(fn ($id) => (int) $id)
            ->filter()
            ->unique()
            ->values()
            ->all();

        Account::query()
            ->where('customer_id', $customer->id)
            ->when($accountIds !== [], fn ($query) => $query->whereNotIn('id', $accountIds))
            ->update(['customer_id' => null]);

        if ($accountIds === []) {
            return;
        }

        Account::query()
            ->whereIn('id', $accountIds)
            ->where(function ($query) use ($customer) {
                $query->whereNull('customer_id')
                    ->orWhere('customer_id', $customer->id);
            })
            ->update(['customer_id' => $customer->id]);
    }

    /**
     * @return array<string, mixed>
     */
    private function present(Customer $customer): array
    {
        return [
            'id' => $customer->id,
            'account_number' => $customer->accountNumber(),
            'first_name' => $customer->first_name,
            'last_name' => $customer->last_name,
            'name' => $customer->fullName(),
            'email' => $customer->email,
            'phone' => $customer->phone,
            'date_of_birth' => $customer->date_of_birth?->format('Y-m-d'),
            'address' => $customer->address,
            'status' => $customer->status,
            'created_at' => $customer->created_at?->format('M j, Y'),
        ];
    }

    /**
     * @return array<string, bool>
     */
    private function abilities(Request $request): array
    {
        $user = $request->user();

        return [
            'create' => $user->can('customers.create'),
            'edit' => $user->can('customers.edit'),
            'delete' => $user->can('customers.delete'),
            'openAccount' => $user->can('accounts.create'),
        ];
    }
}
