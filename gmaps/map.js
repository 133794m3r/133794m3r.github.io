var map;
var locations = [];

function initialiseMap() {


  $.getJSON("https://sheets.googleapis.com/v4/spreadsheets/1kn8vIEY1vZXtMSWz40bnvopderkFqYuvWx1lDg5uhvM/values/Form Responses!A2:Q?key=AIzaSyDfUZGrOEecuIO-isPQyb6tL6CK3pfccX4", function(data) {
    	// data.values contains the array of rows from the spreadsheet. Each row is also an array of cell values.
    	// Modify the code below to suit the structure of your spreadsheet.
    	$(data.values).each(function() {
    		var location = {};
    			location.url = this [1];
				location.title = this[2];
				location.latitude = parseFloat(this[8]);
      	        location.longitude = parseFloat(this[9]);
	  		    locations.push(location);
    	});

      // Center on (0, 0). Map center and zoom will reconfigure later (fitbounds method)
      var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(0, 0)
      };
      console.log('done')
      var map = new google.maps.Map(document.getElementById('map'), mapOptions);
      setLocations(map, locations);
  });
}


function setLocations(map, locations) {
  var bounds = new google.maps.LatLngBounds();
  // Create nice, customised pop-up boxes, to appear when the marker is clicked on
  var infowindow = new google.maps.InfoWindow({
    content: "This is a window"
  });
  for (var i = 0; i < locations.length; i++) {
    var new_marker = createMarker(map, locations[i], infowindow);
    bounds.extend(new_marker.position);
  }
  map.fitBounds(bounds);
}

function createMarker(map, location, infowindow) {

  // Modify the code below to suit the structure of your spreadsheet (stored in variable 'location')
  var position = {
    lat: parseFloat(location.latitude),
    lng: parseFloat(location.longitude)
  };
  var marker = new google.maps.Marker({
    position: position,
    map: map,
    title: location.title,
  });
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent('<div>'+
    '<p><strong>' + ((location.url === undefined) ? location.title : ('<a href="' + location.url +'">' + location.title + '</a>')) + '</strong></p>' +
    ((location.institution === undefined) ? "" : ('<p><strong>Lead institution: </strong>' + location.institution + '</p>')) +
    ((location.department === undefined) ? "" : ('<p><strong>Department: </strong>' + location.department + '</p>')) +
    ((location.funder === undefined) ? "" : ('<p><strong>Funder: </strong>' + location.funder + '</p>')) +
    '</div>');
    infowindow.open(map, marker);
  });
  return marker;
}
