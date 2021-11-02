const bigID = 'C09E3957-507E-4CD9-B55B-453A1D766624';

function quantile(arr, q) {
    const sorted = arr.sort((a, b) => a - b);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;

    if (sorted[base + 1] !== undefined) {
        return Math.floor(sorted[base] + rest * (sorted[base + 1] - sorted[base]));
    } else {
        return Math.floor(sorted[base]);
    }
};

function prepareData(result) {
	return result.data.map(item => {
		item.date = item.timestamp.split('T')[0];

		return item;
	});
}

// helpers
function tableRow(dates) {
	dates.sort((a, b) => a - b);
  
	return {
		hits: dates.length,
		p25: quantile(dates, 0.25),
		p50: quantile(dates, 0.5),
		p75: quantile(dates, 0.75),
		p95: quantile(dates, 0.95)
	};
}

function table(data) {
	let result = {};
	let table = {};

	for (let { name, value } of data) {
	  if (result[name]) {
		  result[name] = [...result[name], value]
		  continue
	  }
	  
	  result[name] = [value];
	}
  
	
	for (let key in result) {
	  table[key] = tableRow(result[key]);
	}
	console.log(table, ' table?')
	
	console.table(table);
}

// TODO: реализовать
// показать значение метрики за несколько день
function showMetricByPeriod(dates, firstDate, secondDate) {
	console.log(`Метрики c ${firstDate} по ${secondDate}`);

	const filteredData = dates.filter(({ date }) => (date >= firstDate) && (date <= secondDate));

	table(filteredData);
}

// показать сессию пользователя
function showSession(id) {
	console.log(`ID сессии${id}`);
}

// любые другие сценарии, которые считаете полезными
// показать сессию пользователя
function showMetricByDay(dates, selectedDate) {
	console.log(`Метрика за ${selectedDate}`);

	const filteredData = dates.filter(({ date }) => date === selectedDate);

	table(filteredData);
}

fetch(`https://shri.yandex/hw/stat/data?counterId=${bigID}`)
  .then((res) => res.json())
  .then((result) => {
    let data = prepareData(result)
	console.log("----------------------------");
    console.log("---------  Metrics ---------");
	console.log("----------------------------");

    showSession(bigID)
    showMetricByDay(data, new Date())
    showMetricByPeriod(data, "2020-09-31", "2022-10-31")

	console.log("----------- end ------------");
  })
