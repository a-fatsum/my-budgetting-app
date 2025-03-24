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
	let incomeStartDate: Temporal.PlainDate;
	let incomePaymentFrequency: string = 'weekly'; // Initialized with a valid value
	let datesOfRegularIncome: string[] = [];
	let regularBalances: number[] = [];
	let data: IncomeInputData[] = [];
	let regularIncomeLabel: string;

	// Subscribe to the store
	arrayOfIncomeInputData.subscribe((value) => {
		data = value;
	});

	// Function to generate income dates
	function generateDates() {
		if (!incomeStartDate) return; // Don't generate dates if no start date is provided
		const start = Temporal.PlainDate.from(incomeStartDate);
		let result: string[] = [];
		let balancesOnIncomeDates: number[] = [];
		let total: number = 0;

		switch (incomePaymentFrequency) {
			case 'weekly':
				for (let i = 0; i < 52; i++) {
					const nextDate = start.add({ days: i * 7 });
					result.push(nextDate.toLocaleString());
					total += Number(regularIncome);
					balancesOnIncomeDates.push(total);
				}
				break;
			case 'fortnightly':
				for (let i = 0; i < 26; i++) {
					const nextDate = start.add({ days: i * 14 });
					result.push(nextDate.toLocaleString());
					total += Number(regularIncome);
					balancesOnIncomeDates.push(Number(total));
				}
				break;
			case 'monthly':
				for (let i = 0; i < 12; i++) {
					const nextDate = start.add({ months: i });
					result.push(nextDate.toLocaleString());
					total += Number(regularIncome);
					balancesOnIncomeDates.push(Number(total));
				}
				break;
			default:
				break;
		}

		datesOfRegularIncome = result;
		regularBalances = balancesOnIncomeDates;
	}

	// Add data to the store
	function addToIncomeInputData() {
		const newEntry: IncomeInputData = {
			incomeLabel: regularIncomeLabel,
			incomeFrequency: incomePaymentFrequency,
			incomeAmount: regularIncome,
			incomeDate: incomeStartDate
		};

		arrayOfIncomeInputData.update((current) => [...current, newEntry]);
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
				<DateInput label="Next Due" bind:date={incomeStartDate} />
			</div>
			<button
				class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				on:click={() => {
					generateDates();
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
			<div class="flex flex-col gap-2 border border-gray-200 bg-[#e3f2fd] p-4">
				<p>Income Added:</p>
				<ul>
					{#each data as entry, i}
						<li>
							Entry {i + 1}: NAME/LABEL {entry.incomeLabel}, {entry.incomeFrequency}, Amount: {entry.incomeAmount},
							Date: {entry.incomeDate?.toLocaleString() || 'N/A'}
						</li>
					{/each}
				</ul>
			</div>
			<h3>Regular Income Dates XXXX</h3>
			<div class="flex">
				<ul class="w-auto p-2 lg:w-auto">
					{#each datesOfRegularIncome as date}
						<li class="p-2">{date}</li>
					{/each}
				</ul>
				<ul class="w-auto p-2 lg:w-auto">
					{#each regularBalances as regBalance}
						<li class="p-2">{regBalance}</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</div>
