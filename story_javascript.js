window.setup = window.setup || {}

setup.showAlert = function () {
	alert("This is a browser alert")
}

setup.measurement = function (gate_array) {
	const Http = new XMLHttpRequest();
	var url='http://127.0.0.1:8008/api/run/do_measurement?gate_array='+gate_array;
	Http.open("GET", url);
	Http.send();
	Http.onreadystatechange = (e) => {
  		console.log(Http.responseText);
		  state.active.variables.result = Http.responseText;
	}
}
