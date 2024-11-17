<script>
	import { onMount } from 'svelte';
	import { Chart } from 'chart.js';

	// Data for the chart
	const data = {
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], // Labels on the x-axis
		datasets: [
			{
				label: 'Sales',
				data: [10, 20, 30, 40, 50], // Sales data for each month
				borderColor: 'rgba(75, 192, 192, 1)', // Line color
				fill: false // No fill under the line
			}
		]
	};

	onMount(() => {
		const ctx = document.getElementById('myChart').getContext('2d');
		new Chart(ctx, {
			type: 'line', // Type of chart (line chart)
			data: data // The data to display
		});
	});
</script>

<div>
	<h2>Sales Data (Line Chart)</h2>
	<canvas id="myChart"></canvas>
	<!-- Canvas element for the chart -->
</div>

<style>
	canvas {
		width: 100%;
		height: 300px; /* Set the height of the chart */
	}
</style>
