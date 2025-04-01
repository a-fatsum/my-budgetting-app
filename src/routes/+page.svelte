<script lang="ts">
	import DashBoard from '$lib/components/DashBoard.svelte';
	import DateInput from '$lib/components/DateInput.svelte';
	import DropDown from '$lib/components/DropDown.svelte';
	import Input from '$lib/components/Input.svelte';
	import { Temporal } from '@js-temporal/polyfill';
	import { arrayOfIncomeInputData } from '../stores/stores';
	import type { IncomeInputData } from '../stores/types';

	let regularIncome: number = 0;
	let monthlySavings: number = 0;
	let incomeDate: Temporal.PlainDate | null = null;
	let incomePaymentFrequency: string = 'weekly';

	let datesOfRegularIncome: Temporal.PlainDate[] = [];
	let regularBalances: number[] = [];
	let data: IncomeInputData[] = [];
	let regularIncomeLabel: string;

	// Subscribe to the store
	arrayOfIncomeInputData.subscribe((value) => {
		data = value;
	});

	// Function to generate income dates
	function generateDates(incomeDate: Temporal.PlainDate, incomePaymentFrequency: string) {
		// if (!incomeDate) return; // Don't generate dates if no start date is provided
		const start = Temporal.PlainDate.from(incomeDate);
		let result: Temporal.PlainDate[] = [];

		switch (incomePaymentFrequency) {
			case 'weekly':
				for (let i = 0; i < 52; i++) {
					const nextDate = start.add({ days: i * 7 });
					result.push(nextDate);
				}
				break;
			case 'fortnightly':
				for (let i = 0; i < 26; i++) {
					const nextDate = start.add({ days: i * 14 });
					result.push(nextDate);
				}
				break;
			case 'monthly':
				for (let i = 0; i < 12; i++) {
					const nextDate = start.add({ months: i });
					result.push(nextDate);
				}
				break;
			default:
				break;
		}
		datesOfRegularIncome = result;
		calculateBalances(datesOfRegularIncome);
	}

	// Add data to the store
	function addToIncomeInputData() {
		const newEntry: IncomeInputData = {
			incomeLabel: regularIncomeLabel,
			incomeFrequency: incomePaymentFrequency,
			incomeAmount: regularIncome,
			incomeDate: incomeDate
		};

		arrayOfIncomeInputData.update((current) => [...current, newEntry]);
	}

	// test -

	// ------

	//
	function generateBalances() {
		// if (incomeDate) {
		generateDates(incomeDate, incomePaymentFrequency);
		// }
	}

	// Calculate balances
	function calculateBalances(dates: Temporal.PlainDate[]) {
		regularBalances = [];
		regularBalances = dates.map((date, i) => {
			let balance = +regularIncome;
			balance += regularIncome * i; // Increment by regularIncome * index
			return balance;
		});
		return regularBalances;
	}
</script>

<div class="shell-wrapper flex text-sm">
	<div class="inputs flex h-screen w-auto flex-col justify-around rounded-md border p-4">
		<div class="incomes flex flex-col justify-around border p-4">
			<div class="reg-income flex flex-col gap-2 p-2">
				<Input label="Regular Income Label" bind:value={regularIncomeLabel} />

				<Input label="Regular Income" bind:value={regularIncome} />
				<DropDown
					label="Frequency"
					options={[
						{ value: 'weekly', text: 'Weekly' },
						{ value: 'fortnightly', text: 'Fortnightly' },
						{ value: 'monthly', text: 'Monthly' },
						{ value: 'periodically', text: 'Periodically' }
					]}
					bind:value={incomePaymentFrequency}
				/>
				<DateInput label="Next Due" bind:date={incomeDate} />
			</div>
			<button
				class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				on:click={() => {
					// generateDates(incomeDate);
					generateBalances();
					addToIncomeInputData();
				}}
			>
				Add
			</button>
		</div>
		<div class="expenses flex flex-col justify-around border p-2">
			<div class="reg-expenses">
				<Input label="Regular Expenses" />
			</div>
			<div class="other-expenses">
				<Input label="Other Expenses" />
			</div>
		</div>
	</div>

	<div class="display h-screen w-auto">
		<div class="display-top m-8 flex w-auto border border-gray-200">
			{#each [1, 2, 3, 4] as _}
				<div class="monthly-savings flex flex-col border border-gray-200 p-4">
					<h4>Monthly Savings</h4>
					{monthlySavings}
				</div>
			{/each}
		</div>
		<div class="display-bottom m-8 flex flex-col border border-gray-200">
			<div class=" border border-gray-200 p-1">
				<p>Income Added:</p>
				<ul class="mt-4 flex flex-col gap-2">
					{#each data as entry, i}
						<li class="border p-2">
							{entry.incomeLabel}, {entry.incomeFrequency}, ${entry.incomeAmount}, Start: {entry.incomeDate?.toLocaleString() ||
								'N/A'}
						</li>
					{/each}
				</ul>
			</div>
			<!--  -->
			<div class="flex">
				<ul class="w-auto p-2 lg:w-auto">
					{#each datesOfRegularIncome as date}
						Date: <li class="p-2">{date.toLocaleString()}</li>
					{/each}
				</ul>
				<ul class="w-auto p-2 lg:w-auto">
					{#each regularBalances as regBalance}
						Balance: <li class="p-2">{regBalance}</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</div>
