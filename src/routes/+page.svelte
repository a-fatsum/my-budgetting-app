<script lang="ts">
	import DashBoard from '$lib/components/DashBoard.svelte';
	import DateInput from '$lib/components/DateInput.svelte';
	import DropDown from '$lib/components/DropDown.svelte';
	import Input from '$lib/components/Input.svelte';
	import { Temporal } from '@js-temporal/polyfill';
	import { arrayOfIncomeInputData } from '../stores/stores';
	import type { IncomeInputData } from '../stores/types';
	import { D1Transaction } from 'drizzle-orm/d1';
	import { render } from 'svelte/server';

	let regularIncome: number = 0;
	let monthlySavings: number = 0;
	let incomeDate: Temporal.PlainDate | null = null;
	let incomePaymentFrequency: string = 'monthly';

	let datesOfRegularIncome: Temporal.PlainDate[] = [];
	// let regularIncomes: number[] = [];
	let regularBalancesForEachEntry: number[] = [];
	let data: IncomeInputData[] = [];
	let regularIncomeLabel: string;

	// Subscribe to the store
	arrayOfIncomeInputData.subscribe((value) => {
		data = value;
	});

	// Function to generate income dates
	function generateDatesAndBalances(
		incomeDate: Temporal.PlainDate,
		incomePaymentFrequency: string
	) {
		// if (!incomeDate) return; // Don't generate dates if no start date is provided
		const start = Temporal.PlainDate.from(incomeDate);
		let tempDatesOfRegularIncome: Temporal.PlainDate[] = [];

		switch (incomePaymentFrequency) {
			case 'weekly':
				for (let i = 0; i < 52; i++) {
					const nextDate = start.add({ days: i * 7 });
					tempDatesOfRegularIncome.push(nextDate);
				}
				break;
			case 'fortnightly':
				for (let i = 0; i < 26; i++) {
					const nextDate = start.add({ days: i * 14 });
					tempDatesOfRegularIncome.push(nextDate);
				}
				break;
			case 'monthly':
				for (let i = 0; i < 12; i++) {
					const nextDate = start.add({ months: i });
					tempDatesOfRegularIncome.push(nextDate);
				}
				break;
			default:
				break;
		}
		//
		// Calculate balances
		function calculateBalancesForIncomeEntry(dates: Temporal.PlainDate[]) {
			regularBalancesForEachEntry = [];
			regularBalancesForEachEntry = dates.map((date, i) => {
				let balance = +regularIncome;
				balance += regularIncome * i; // Increment by regularIncome * index
				return balance;
			});
			return regularBalancesForEachEntry;
		}
		//
		regularBalancesForEachEntry = calculateBalancesForIncomeEntry(tempDatesOfRegularIncome);
		datesOfRegularIncome = tempDatesOfRegularIncome;
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
	//

	let renderedLists: any[] = [];

	function generateRenderedData() {
		// Initialize a temporary array for the new entries
		let listOfDatesAndIncomes: ConcatArray<any> = [];

		for (let i = 0; i < data.length; i++) {
			// Generate dates and balances for each data entry
			generateDatesAndBalances(data[i].incomeDate, data[i].incomeFrequency);
			// console.log('data[i].incomeDate', data[i].incomeDate);
			// console.log('data[i].incomeFrequency', data[i].incomeFrequency);
			// Create a base rendered data object
			let renderedData = {
				label: data[i].incomeLabel,
				date: datesOfRegularIncome[i],
				balance: regularBalancesForEachEntry[i]
			};
			// Use a different variable (j) for the inner loop index to avoid confusion
			datesOfRegularIncome.forEach((date, j) => {
				const calculatedBalance = regularBalancesForEachEntry[j];
				// Create a new object for each iteration instead of reassigning renderedData
				const currentRenderedData = {
					label: renderedData.label,
					date: date,
					balance: calculatedBalance
				};
				listOfDatesAndIncomes.push(currentRenderedData);
			});
		}
		listOfDatesAndIncomes.sort((a, b) => Temporal.PlainDate.compare(a.date, b.date));
		// Append new entries to renderedLists without overwriting the old ones
		renderedLists = renderedLists.concat(listOfDatesAndIncomes);
	}

	// let renderedLists: any[] = [];
	// function generateRenderedData() {
	// 	let listOfDatesAndIncomes: any[] = [];
	// 	//
	// 	for (let i = 0; i < data.length; i++) {
	// 		listOfDatesAndIncomes = [];
	// 		generateDatesAndBalances(data[i].incomeDate, data[i].incomeFrequency);
	// 		//
	// 		console.log('data[i].incomeDate', data[i].incomeDate);
	// 		console.log('data[i].incomeFrequency', data[i].incomeFrequency);
	// 		//
	// 		let renderedData = {
	// 			label: data[i].incomeLabel,
	// 			date: datesOfRegularIncome[i],
	// 			balance: regularBalancesForEachEntry[i]
	// 		};
	// 		//
	// 		datesOfRegularIncome.forEach((date, i) => {
	// 			// listOfDatesAndIncomes = [];
	// 			const calculatedBalance = regularBalancesForEachEntry[i];
	// 			renderedData = {
	// 				label: renderedData.label,
	// 				date: renderedData.date,
	// 				balance: calculatedBalance
	// 			};
	// 			listOfDatesAndIncomes.push(renderedData);
	// 		});
	// 	}

	// 	// I just want to update listOfDatesAndIncomes without overriding the old values
	// 	// ****************************
	// 	// I have an array of objects called data. it contains this const newEntry: IncomeInputData = {
	// 	// 	incomeLabel: regularIncomeLabel,
	// 	// 	incomeFrequency: incomePaymentFrequency,
	// 	// 	incomeAmount: regularIncome,
	// 	// 	incomeDate: incomeDate
	// 	// };
	// 	// This array gets updated everytime the user makes an input and a function is called addToIncomeInputData(). What I want to do is, update this new array called
	// 	// renderedLists[]. This array contains objects like  const renderedData = {
	// 	// 		label: data[i].incomeLabel,
	// 	// 		date: datesOfRegularIncome[i],
	// 	// 		balance: regularBalancesForEachEntry[i]
	// 	// 	};
	// 	// I need the old inputs to remain and for the array renderedLists to just be updated with the new entries

	// 	// ******************************
	// 	listOfDatesAndIncomes.sort((a, b) => Temporal.PlainDate.compare(a.date, b.date));

	// 	let updatedListOfDatesAndIncomes: any[] = [];

	// 	console.log('listOfDatesAndIncomes', listOfDatesAndIncomes);
	// 	renderedLists = listOfDatesAndIncomes;
	// }
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
					addToIncomeInputData();
					generateRenderedData();
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
				<div class="flex w-auto flex-col p-2 lg:w-auto">
					{#each renderedLists as { label, date, balance }, i}
						<!-- <div>{label} {date.toLocaleString()} ${balance}</div> -->
						<div>{label} {date.toLocaleString()} ${balance}</div>
					{/each}
				</div>
				<!-- <div class="flex w-auto flex-col p-2 lg:w-auto">
					{#each renderedLists as { label, date, balance }, i}
						<div>{label} {date.toLocaleString()} ${balance}</div>
					{/each}
				</div> -->
			</div>
		</div>
	</div>
</div>
