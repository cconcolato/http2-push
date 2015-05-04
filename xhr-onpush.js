var xhr;
xhr = new XMLHttpRequest();
xhr.open("GET", "https://localhost:8091/file1.txt?push=file2.txt", true);
xhr.onload = function () {
	console.log("xhr state="+this.readyState+" status="+this.status+" response:", this.response);
	document.getElementById('debug').innerHTML = this.response+"<br>";

	var xhr2 = new XMLHttpRequest();
	xhr2.open("GET", "https://localhost:8091/file2.txt", true);
	xhr2.onreadystatechange = function () {
		console.log("xhr2 onchange state="+this.readyState+" status="+this.status+" response:", this.response);
	}
	xhr2.onload = function () {
		console.log("xhr2 onload state="+this.readyState+" status="+this.status+" response:", this.response);
		document.getElementById('debug').innerHTML += this.response;
	}
	xhr2.send();
}
xhr.send();
