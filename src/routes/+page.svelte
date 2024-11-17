<script lang="ts">
	import DashBoard from '$lib/components/DashBoard.svelte';
	import DateInput from '$lib/components/DateInput.svelte';
	import DropDown from '$lib/components/DropDown.svelte';
	import Input from '$lib/components/Input.svelte';
	import { onMount } from 'svelte';
	import { Temporal } from '@js-temporal/polyfill';
	//
	let regularIncome: number = 0;
	let monthlySavings: number = 0;
	let incomeStartDate: Temporal.PlainDate | null = null;
	let incomePaymentFrequency: string = 'weekly'; // Ensure it's initialized with a valid value
	let datesOfRegularIncome: string[] = [];
	let regularBalances: number[] = [];

	function generateDates() {
		if (!incomeStartDate) return; // Don't generate dates if no start date is provided
		let regularBalancesResults: number[] = [];

		const start = incomeStartDate; // Use the already-typed Temporal.PlainDate
		let result: string[] = []; // Store the generated dates
		let startBalanceTotal: number = 0;

		switch (incomePaymentFrequency) {
			case 'weekly':
				for (let i = 0; i < 52; i++) {
					const nextDate = start.add({ weeks: i });
					result.push(
						nextDate.toLocaleString('en-AU', {
							weekday: 'long', // Displays the full name of the day
							year: 'numeric',
							month: 'numeric',
							day: 'numeric'
						})
					); // Adds the date in 'YYYY-MM-DD' format
					startBalanceTotal += Number(regularIncome); // Ensure numeric addition
					regularBalancesResults.push(startBalanceTotal);
				}
				break;

			case 'fortnightly':
				for (let i = 0; i < 26; i++) {
					const nextDate = start.add({ weeks: i * 2 }); // Add 2 weeks for fortnightly
					result.push(
						nextDate.toLocaleString('en-AU', {
							weekday: 'long', // Displays the full name of the day
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
					const nextDate = start.add({ months: i }); // Add 1 month for each iteration
					result.push(
						nextDate.toLocaleString('en-AU', {
							weekday: 'long', // Displays the full name of the day
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

		datesOfRegularIncome = result; // Update the reactive array of dates
		regularBalances = [...regularBalancesResults]; // Ensure type consistency
	}
	//
	// Store inputs in local stprage
	// Function to store values in localStorage
	function storeInLocalStorage() {
		const incomeData = {
			regularIncome,
			incomePaymentFrequency,
			incomeStartDate
		};

		// Save the object as a JSON string in localStorage
		localStorage.setItem('incomeData', JSON.stringify(incomeData));

		console.log('Data stored in localStorage:', incomeData);
	}

	// OnMount to load saved data from localStorage when the page is reloaded
	onMount(() => {
		const savedData = localStorage.getItem('incomeData');
		if (savedData) {
			const parsedData = JSON.parse(savedData);
			regularIncome = parsedData.regularIncome;
			incomePaymentFrequency = parsedData.incomePaymentFrequency;
			incomeStartDate = parsedData.incomeStartDate;
		}
	});

	//
</script>

<!--  -->
<div class="shell-wrapper flex text-sm">
	<div class="inputs rounder-md flex h-screen w-auto flex-col justify-around border p-4">
		<div class="incomes flex flex-col justify-around border p-4">
			<!--  -->
			<!--  -->
			<div class="reg-income flex flex-col gap-2 p-2">
				<!-- <h1>regular income</h1> -->
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
				<!--  -->
				<DateInput label={'Next Due'} bind:date={incomeStartDate} />
			</div>
			<button
				class=" rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				on:click={() => {
					generateDates();
					storeInLocalStorage();
				}}>Add</button
			>
		</div>
		<div class="expenses flex flex-col justify-around border p-2">
			<div class="reg-expenses">
				<!-- <h1>regular expenses</h1> -->
				<Input label={'Regular Expenses'} />
			</div>
			<div class="other-expenses">
				<!-- <h1>other expenses</h1> -->
				<Input label={'Other Expenses'} />
			</div>
		</div>
	</div>

	<div class="display h-screen w-auto">
		<div class="display-top m-8 flex w-auto border border-gray-200">
			<div class=" monthly-savings flex flex-col border border-gray-200 p-4">
				<h4>Monthly Savings</h4>
				{monthlySavings}
			</div>
			<div class=" monthly-savings flex flex-col border border-gray-200 p-4">
				<h4>Monthly Savings</h4>
				{monthlySavings}
			</div>
			<div class=" monthly-savings flex flex-col border border-gray-200 p-4">
				<h4>Monthly Savings</h4>
				{monthlySavings}
			</div>
			<div class=" monthly-savings flex flex-col border border-gray-200 p-4">
				<h4>Monthly Savings</h4>
				{monthlySavings}
			</div>
		</div>
		<div class="display-bottom m-8 flex w-auto flex-col border border-gray-200">
			<div class="flex w-auto flex-col gap-2 border border-gray-200 p-4">
				<p>income added</p>
				{regularIncome}
				{incomePaymentFrequency}
				{incomeStartDate}
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
