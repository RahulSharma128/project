
window.onload = function () {

	//CODE FOR WEATHER API
	const timeEl = document.getElementById('time');
	const dateEl = document.getElementById('date');
	const currentWeatherItemsEl = document.getElementById('current-weather-items');
	const timezone = document.getElementById('time-zone');
	const countryEl = document.getElementById('country');
	const weatherForecastEl = document.getElementById('weather-forecast');
	const currentTempEl = document.getElementById('current-temp');

	const dayy=[];
	const nightt=[];
	const morningg=[];
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
	const API_KEY ='dbe120363a9941cfec6e2cada7f731d1';
	
	setInterval(() => {
		const time = new Date();
		const month = time.getMonth();
		const date = time.getDate();
		const day = time.getDay();     
		const hour = time.getHours();
		const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
		const minutes = time.getMinutes();
		const ampm = hour >=12 ? 'PM' : 'AM'
	
		timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`
	
		dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]
	
	}, 1000);
	
	getWeatherData()
	function getWeatherData () {
		navigator.geolocation.getCurrentPosition((success) => {
			
			let {latitude, longitude } = success.coords;
	
			fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
	
			console.log(data)
			showWeatherData(data);
			})
	
		})
	}
	
	function showWeatherData (data){
		let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;
	
		timezone.innerHTML = data.timezone;
		countryEl.innerHTML = data.lat + 'N ' + data.lon+'E'
	
		currentWeatherItemsEl.innerHTML = 
		`<div class="weather-item">
			<div>Humidity</div>
			<div>${humidity}%</div>
		</div>
		<div class="weather-item">
			<div>Pressure</div>
			<div>${pressure}</div>
		</div>
		<div class="weather-item">
			<div>Wind Speed</div>
			<div>${wind_speed}</div>
		</div>
	
		<div class="weather-item">
			<div>Sunrise</div>
			<div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
		</div>
		<div class="weather-item">
			<div>Sunset</div>
			<div>${window.moment(sunset*1000).format('HH:mm a')}</div>
		</div>
		
		
		`;
	    
		let otherDayForcast = ''
		data.daily.forEach((day, idx) => {  	
			//console.log(window.moment(day.dt*1000).format('ddd'));
		 dayy.push(window.moment(day.dt*1000).format('ddd'));  
			if(idx == 0){
				currentTempEl.innerHTML = `
				<img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
				<div class="other">
					<div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
					<div class="temp">Night - ${day.temp.night}&#176;C</div>
					<div class="temp">Day - ${day.temp.day}&#176;C</div>
				</div>
				
				`
				//console.log(window.moment(day.dt*1000).format('ddd'));
				
				nightt.push(day.temp.night);
				morningg.push(day.temp.day);
			}else{
				otherDayForcast += `
				<div class="weather-forecast-item">
					<div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
					<img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
					<div class="temp">Night - ${day.temp.night}&#176;C</div>
					<div class="temp">Day - ${day.temp.day}&#176;C</div>
				</div>
				
				`
				//console.log(window.moment(day.dt*1000).format('ddd'));
				
				nightt.push(day.temp.night);
				morningg.push(day.temp.day);
				

			}
			//console.log(moment());
           

		})
	
	//CAHART FROM CANVASSSS.
	var chart = new CanvasJS.Chart("chartContainer", {            
		title:{
			text: "Weekly Weather Forecast"              
		},
		axisY: {
			suffix: " °C",
			maximum: 40,
			gridThickness: 1	
		},
		toolTip:{
			shared: true,
			content: "{name} </br> <strong>Temperature: </strong> </br> Min: {y[0]} °C, Max: {y[1]} °C"
		},
		data: [{
			type: "rangeSplineArea",
			fillOpacity: .8,
			color: "#91AAB1",
			indexLabelFormatter: formatter,
            
			dataPoints: [
				{ label: dayy[0], y: [nightt[0],morningg[0]]},
				{ label: dayy[1], y: [nightt[1], morningg[1]] },
				{ label: dayy[2], y: [nightt[2], morningg[2]] },
				{ label: dayy[3], y: [nightt[3], morningg[3]]},
				{ label: dayy[4], y: [nightt[4], morningg[4]] },
				{ label: dayy[5], y: [nightt[5], morningg[5]]},
				{ labe1: dayy[6], y: [nightt[6], morningg[6]]}
			]
		}]
	});
	chart.render();
	
	var images = [];    
	
	addImages(chart);
	
	function addImages(chart) {
		for(var i = 0; i < chart.data[0].dataPoints.length; i++){
			var dpsName = chart.data[0].dataPoints[i].name;
			if(dpsName == "cloudy"){
				images.push($("<img>").attr("src", "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/cloudy.png"));
			} else if(dpsName == "rainy"){
			images.push($("<img>").attr("src", "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/rainy.png"));
			} else if(dpsName == "sunny"){
				images.push($("<img>").attr("src", "https://canvasjs.com/wp-content/uploads/images/gallery/gallery-overview/sunny.png"));
			}
	
		images[i].attr("class", dpsName).appendTo($("#chartContainer>.canvasjs-chart-container"));
		positionImage(images[i], i);
		}
	}
	
	function positionImage(image, index) {
		var imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[index].x);
		var imageTop =  chart.axisY[0].convertValueToPixel(chart.axisY[0].maximum);
	
		image.width("40px")
		.css({ "left": imageCenter - 20 + "px",
		"position": "absolute","top":imageTop + "px",
		"position": "absolute"});
	}
	
	$( window ).resize(function() {
		var cloudyCounter = 0, rainyCounter = 0, sunnyCounter = 0;    
		var imageCenter = 0;
		for(var i=0;i<chart.data[0].dataPoints.length;i++) {
			imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[i].x) - 20;
			if(chart.data[0].dataPoints[i].name == "cloudy") {					
				$(".cloudy").eq(cloudyCounter++).css({ "left": imageCenter});
			} else if(chart.data[0].dataPoints[i].name == "rainy") {
				$(".rainy").eq(rainyCounter++).css({ "left": imageCenter});  
			} else if(chart.data[0].dataPoints[i].name == "sunny") {
				$(".sunny").eq(sunnyCounter++).css({ "left": imageCenter});  
			}                
		}
	});
	
	function formatter(e) { 
		if(e.index === 0 && e.dataPoint.x === 0) {
			return " Min " + e.dataPoint.y[e.index] + "°";
		} else if(e.index == 1 && e.dataPoint.x === 0) {
			return " Max " + e.dataPoint.y[e.index] + "°";
		} else{
			return e.dataPoint.y[e.index] + "°";
		}
	} 
	
		weatherForecastEl.innerHTML = otherDayForcast;
	}

	}
	