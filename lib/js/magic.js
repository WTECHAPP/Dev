function menuToggle(){		
	if (document.getElementById("navBtn").className == "navOpen") {
		document.getElementById("navBtn").className = "";
		document.getElementById("listMenu").className = "";
		document.getElementById("shadowbox").className = "";
	} else {
		document.getElementById("navBtn").className = "navOpen";
		document.getElementById("listMenu").className = "listOpen";
		document.getElementById("shadowbox").className = "visible";
	}
}