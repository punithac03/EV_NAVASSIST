const source = document.getElementById('source');
const destination = document.getElementById('destination');
window.addEventListener('load', initMap);

let map, directionsRenderer, directionsService, sourceAutoComplete, destinationAutoComplete;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 12.2958, lng: 76.6394},
    zoom: 13
  });

  google.maps.event.addListener(map, "click", function(event) {
    this.setOptions({scrollwheel: true});
  }, { passive: true });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  // sourceAutoComplete = new google.maps.places.AutoComplete(source);
  // destinationAutoComplete = new google.maps.places.AutoComplete(destination);
}

// Fetching current source location

const currentSource = document.getElementById('current-source');

currentSource.addEventListener('click', fetchCurrentSourceLocation);

function fetchCurrentSourceLocation (){
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords.latitude, position.coords.longitude)

      const locality = `https://api-bdc.net/data/reverse-geocode?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&key=bdc_6f12d95b756c44699118a4c14362bedb`

      getAPI(locality, updateSourceValue);
    }, (err) => {
      alert(err.message)
    })
  } else {
    alert("Geolocation is not supported by browser")
  }
}

function updateSourceValue(value) {
  source.value = value;
}

// Fetching current destination location
const currentDestination = document.getElementById('current-destination');

currentDestination.addEventListener('click', fetchCurrentDestinationLocation);

function fetchCurrentDestinationLocation (){
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords.latitude, position.coords.longitude)

      const locality = `https://api-bdc.net/data/reverse-geocode?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&key=bdc_6f12d95b756c44699118a4c14362bedb`

      getAPI(locality, updateDestinationValue);
    }, (err) => {
      alert(err.message)
    })
  } else {
    alert("Geolocation is not supported by browser")
  }
}

function updateDestinationValue(value) {
  destination.value = value;
}

const http = new XMLHttpRequest();

function getAPI(locality, updateValueCallback) {
  http.open("GET", locality);
  http.send();
  http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const result = JSON.parse(this.responseText)
      console.log(result.locality)
      updateValueCallback(result.locality);
    }
  }
}


// Interchanging source and destination values
const interchangeSourceDestination = document.getElementById('interchange-source-destination');
interchangeSourceDestination.addEventListener('click', interchangeSourceDestinationValues);

function interchangeSourceDestinationValues() {
  const temp = source.value;
  source.value = destination.value;
  destination.value = temp;
}

// Find Routes button click event
const findRoutes = document.querySelector('.find-routes button');
findRoutes.addEventListener('click', validateAndFindRoutes);

function validateAndFindRoutes() {
  const sourceValue = source.value.trim();
  const destinationValue = destination.value.trim();

  if (sourceValue === '' || destinationValue === '') {
    alert('Please enter both the source and destination.');
    return;
  }

  if (sourceValue === destinationValue) {
    alert('Source and destination cannot be the same.');
    return;
  }

  if (!/^[a-zA-Z\s]+$/.test(sourceValue) || !/^[a-zA-Z\s]+$/.test(destinationValue)) {
    alert('Source and destination should only contain alphabetic characters and spaces.');
    return;
  }

  calculateRoutes();
}
/*
function calculateRoutes() {
  console.log("Finding routes")
  let result = {
    origin:source.value,
    destination:destination.value,
    travelMode:'DRIVING',
  }

  directionsService.route(result, function(result, status) {
    if (status == "OK") {
      directionsRenderer.setDirections(result)
    }
  })
}
*/
/*
function calculateRoutes() {
  console.log("Finding routes");
  let result = {
    origin: source.value,
    destination: destination.value,
    travelMode: 'DRIVING',
  };

  directionsService.route(result, function(result, status) {
    if (status == "OK") {
      directionsRenderer.setDirections(result);

      const routeData = {
        source: result.routes[0].legs[0].start_location,
        destination: result.routes[0].legs[0].end_location,
        waypoints: result.routes[0].legs[0].via_waypoints,
      };

      // Initialize the xhr variable
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "/calculateChargingStations");
      xhr.setRequestHeader("Content-Type", "application/json");      
      
      console.log("Send-3")
      // Set the onreadystatechange property
      xhr.onreadystatechange = function () {
        console.log("Send-4")
        if (this.readyState == 4 && this.status == 200) {
          console.log("Send-5")
          const response = JSON.parse(this.responseText);
          console.log("Send-6")
          const chargingStations = response.charging_stations;
          const chargingStationCount = response.charging_station_count;

          console.log(`Charging Stations Count: ${chargingStationCount}`);

          // Mark the charging stations on the map
          chargingStations.forEach(chargingStation => {
            const marker = new google.maps.Marker({
              position: { lat: chargingStation.latitude, lng: chargingStation.longitude },
              map: map,
              title: chargingStation.name
            });
          });
        }
      };
      xhr.send(JSON.stringify(routeData));
    }
  });
}
*/
var routeData;
function calculateRoutes() {
  let result = {
    origin: source.value,
    destination: destination.value,
    travelMode: 'DRIVING',
  };

  directionsService.route(result, function(result, status) {
    if (status == "OK") {
      directionsRenderer.setDirections(result);

      routeData = {
        source: result.routes[0].legs[0].start_location,
        destination: result.routes[0].legs[0].end_location,
        waypoints: result.routes[0].legs[0].via_waypoints,
      };

      // Initialize the xhr variable
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "/calculateChargingStations");
      xhr.setRequestHeader("Content-Type", "application/json");

      // Add the CSRF token to the request headers
      const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
      xhr.setRequestHeader("X-CSRFToken", csrfToken);

      // Set the onreadystatechange property
      xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          const response = JSON.parse(xhr.response); // Updated this line
          const chargingStations = response.charging_stations;
          const chargingStationCount = response.charging_station_count;
      
          console.log(`Charging Stations Count: ${chargingStationCount}`);
          document.querySelector('.charging-stations-found_1').innerHTML = chargingStationCount;
      
          // Check if chargingStations is an array
          if (chargingStations !== null && Array.isArray(chargingStations)) {
            // Mark the charging stations on the map
            chargingStations.forEach(chargingStation => {
                const marker = new google.maps.Marker({
                    position: { lat: chargingStation.latitude, lng: chargingStation.longitude },
                    map: map,
                    title: chargingStation.name
                });
                // displayChargingStationInfo(chargingStation);
            });
        } else {
            console.log('Charging stations data is not an array or is null');
        }
        
        }
      };
      
      xhr.send(JSON.stringify(routeData));
    }
  }); // Add the missing closing parenthesis here
}
function displayChargingStationInfo(chargingStation) {
  // Create a div element for charging station information
  const chargingStationInfo = document.createElement('div');
  chargingStationInfo.classList.add('charging-station-info');

  // Compute distance from source to charging station
  const source = new google.maps.LatLng(routeData.source.lat, routeData.source.lng);
  const chargingStationLocation = new google.maps.LatLng(chargingStation.latitude, chargingStation.longitude);
  const distance = google.maps.geometry.spherical.computeDistanceBetween(source, chargingStationLocation);

  // Create paragraphs for each detail
  const nameParagraph = document.createElement('p');
  nameParagraph.textContent = `Name: ${chargingStation.name}`;

  const addressParagraph = document.createElement('p');
  addressParagraph.textContent = `Address: ${chargingStation.address}`;

  var dist = getDistance(source.latitude, )
  const distanceParagraph = document.createElement('p');
  distanceParagraph.textContent = `Distance from source: ${distance} meters`;

  // Append paragraphs to the charging station information div
  chargingStationInfo.appendChild(nameParagraph);
  chargingStationInfo.appendChild(addressParagraph);
  chargingStationInfo.appendChild(distanceParagraph);

  // Append the charging station information div to the container div
  const csDiv = document.createElement('div');
  csDiv.setAttribute('id', 'cs');
  csDiv.appendChild(chargingStationInfo);

  // Append the csDiv to the display-information div
  const displayInformationDiv = document.getElementById('display-information');
  displayInformationDiv.appendChild(csDiv);
}

function getDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371; // Radius of the earth in kilometers

  // Convert latitude and longitude to radians
  const lat1Rad = toRadians(lat1);
  const lon1Rad = toRadians(lon1);
  const lat2Rad = toRadians(lat2);
  const lon2Rad = toRadians(lon2);

  // Calculate the differences between latitudes and longitudes
  const latDiff = lat2Rad - lat1Rad;
  const lonDiff = lon2Rad - lon1Rad;

  // Apply Haversine formula
  const a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  return distance;
}

// Helper function to convert degrees to radians
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}
