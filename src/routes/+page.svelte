<script lang="ts">
	import DashBoard from '$lib/components/DashBoard.svelte';
	import DateInput from '$lib/components/DateInput.svelte';
	import DropDown from '$lib/components/DropDown.svelte';
	import Input from '$lib/components/Input.svelte';
	import { onMount } from 'svelte';
	import { Temporal } from '@js-temporal/polyfill';

	// Input fields
	let regularIncome: number = 0;
	let monthlySavings: number = 0;
	let incomeStartDate: Temporal.PlainDate;
	let incomePaymentFrequency: string = 'weekly'; // Initialized with a valid value
	let datesOfRegularIncome: string[] = [];
	let regularBalances: number[] = [];

	// Function to generate income dates
	function generateDates() {
		if (!incomeStartDate) return; // Don't generate dates if no start date is provided
		let regularBalancesResults: number[] = [];
		const start = incomeStartDate;
		let result: string[] = [];
		let startBalanceTotal: number = 0;

		switch (incomePaymentFrequency) {
			case 'weekly':
				for (let i = 0; i < 52; i++) {
					const nextDate = start.add({ weeks: i });

					// Fix: No direct comparison of Temporal.PlainDate objects.
					// Instead of comparing with `==` or `===`, use equals or compare()
					if (nextDate.equals(incomeStartDate)) {
						// If the dates are the same (for example), do something special here.
						console.log('The dates are equal!');
					}

					result.push(
						nextDate.toLocaleString('en-AU', {
							weekday: 'long',
							year: 'numeric',
							month: 'numeric',
							day: 'numeric'
						})
					);
					startBalanceTotal += Number(regularIncome);
					regularBalancesResults.push(startBalanceTotal);
				}
				break;

			case 'fortnightly':
				for (let i = 0; i < 26; i++) {
					const nextDate = start.add({ weeks: i * 2 });

					// Fix: Using .equals() or .compare() to compare dates
					if (nextDate.equals(incomeStartDate)) {
						console.log('The dates are equal!');
					}

					result.push(
						nextDate.toLocaleString('en-AU', {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})
					);
					startBalanceTotal += Number(regularIncome);
					regularBalancesResults.push(startBalanceTotal);
				}
				break;

			case 'monthly':
				for (let i = 0; i < 12; i++) {
					const nextDate = start.add({ months: i });

					// Fix: Again using .equals() or .compare() to compare dates
					if (nextDate.equals(incomeStartDate)) {
						console.log('The dates are equal!');
					}

					result.push(
						nextDate.toLocaleString('en-AU', {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})
					);
					startBalanceTotal += Number(regularIncome);
					regularBalancesResults.push(startBalanceTotal);
				}
				break;

			default:
				break;
		}

		datesOfRegularIncome = result;
		regularBalances = [...regularBalancesResults];
		console.log(incomeInputData);
	}
	//

	let incomeInputData: {
		incomeFrequency?: string;
		// incomeAmount?: number;
		// incomeDate?: Temporal.PlainDate;
	};

	// Function to add data to the object
	function addToIncomeInputData() {
		// incomeInputData.incomeFrequency = incomePaymentFrequency;
		// incomeInputData.incomeAmount = regularIncome;
		// incomeInputData.incomeDate = incomeStartDate;
		console.log(incomeInputData);
	}

	// Function to clear the object
	function clearData() {
		incomeInputData = {}; // Reset the object to an empty state
	}
</script>

<div class="shell-wrapper flex text-sm">
	<div class="inputs rounder-md flex h-screen w-auto flex-col justify-around border p-4">
		<div class="incomes flex flex-col justify-around border p-4">
			<div class="reg-income flex flex-col gap-2 p-2">
				<Input label={'Regular Income'} bind:value={regularIncome} />
				<DropDown
					label={'Frequency'}
					options={[
						{ value: 'weekly', text: 'Weekly' },
						{ value: 'fortnightly', text: 'Fortnightly' },
						{ value: 'monthly', text: 'Monthly' }
					]}
					bind:value={incomePaymentFrequency}
				/>
				<DateInput label={'Next Due'} bind:date={incomeStartDate} />
			</div>
			<button
				class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				on:click={() => {
					generateDates();
					// storeInLocalStorage();
					addToIncomeInputData();
				}}
			>
				Add
			</button>
		</div>
		<div class="expenses flex flex-col justify-around border p-2">
			<div class="reg-expenses">
				<Input label={'Regular Expenses'} />
			</div>
			<div class="other-expenses">
				<Input label={'Other Expenses'} />
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
		<div class="display-bottom m-8 flex w-auto flex-col border border-gray-200">
			<div class="flex w-auto flex-col gap-2 border border-gray-200 p-4">
				<p>Income Added:</p>
				<p>{regularIncome}</p>
				<p>{incomePaymentFrequency}</p>
				<p>{incomeStartDate}</p>
				{incomeInputData}
			</div>
			<h3>Regular Income Dates</h3>
			<div class="flex w-auto flex-wrap gap-4">
				<ul class="flex-1 p-2 lg:w-auto">
					{#each datesOfRegularIncome as date}
						<li class="border p-2">{date}</li>
					{/each}
				</ul>

				<ul class="flex-1 p-2 lg:w-auto">
					{#each regularBalances as regBalance}
						<li class="border p-2">{regBalance}</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</div>
