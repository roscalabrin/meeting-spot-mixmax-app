function initialize() {
  initAutocomplete();
  initMap();
}

var autocomplete
var autocomplete2
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
}

function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      { types: ['geocode']} )
  autocomplete2 = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete2')),
      { types: ['geocode']} )
  autocomplete.addListener('place_changed', () => {
    const location = $('.location1-search-field').val()
    new SetLocation('location1', location)
  }) 
  autocomplete2.addListener('place_changed', () => {
    const location = $('.location2-search-field').val()
    new SetLocation('location2', location)
  }) 
}

function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      })
      autocomplete.setBounds(circle.getBounds())
    })
  }
}

var request;
var service;
var markers = [];

function initMap() {
  const center = new google.maps.LatLng(37.782769, -122.392745)
  map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: 15,
    mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.RIGHT_TOP
        },
  })
  
  request = {
    location: center,
    radius: 01,
    type: ['cafe']
  }

  infowindow = new google.maps.InfoWindow()
  service = new google.maps.places.PlacesService(map)
  service.nearbySearch(request, function(){})
  const centerControlDiv = document.createElement('div')
  const centerControl = new CenterControl(centerControlDiv, map)

  centerControlDiv.index = 1
  map.controls[google.maps.ControlPosition.LEFT_TOP].push(centerControlDiv)
}
  
  function callback(results, status) {
    var filteredResults = results.filter(isNotStore)
    if ((status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) || (filteredResults === [])) {
      $('.no-results')[0].classList.remove('hide')
      $('.error-missing-location')[0].classList.add('hide')
    } else if (status === google.maps.places.PlacesServiceStatus.OK) {
      handleResponse(results)
    }
  }
  
  function handleResponse(results) {
    $('.error-missing-location')[0].classList.add('hide')
    $('.no-results')[0].classList.add('hide')
    for (var i = 0; i < results.length; i++) {
      if (results[i].types.includes('store') === false) {
        markers.push(createMarker(results[i]))
      }
    }
  }
  
  function isNotStore(placeObject) {
    return placeObject.types.includes('store') === false
  }

  function createMarker(place) {
    const placeLoc = place.geometry.location;
    const marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    })

    google.maps.event.addListener(marker, 'click', () => {
      service.getDetails(place, (result) => {
        const contentData = `<div id="content">
            <div><img class"img-icon" src=${result.icon} /></div>
            <div class="place-details">
              <h3>${result.name}</h3>
              <p>${result.formatted_address}</p>
              <p><a href=${result.website}>${result.website}</a></p>
            <div>
          </div>`
        infowindow.setContent(contentData);
        infowindow.open(map, marker);
      })
    })
  }
  
  function clearResults(markers) {
    for (var m in markers) {
      if (markers[m] !== undefined) {
        markers[m].setMap(null)
      }
    }
    markers = []
  }
      
  function CenterControl(controlDiv, map) {
    const controlUI = document.createElement('div');
    controlUI.className = 'search-btn'
    controlUI.title = 'Click to find search coffee shops';
    controlDiv.appendChild(controlUI);

    const controlText = document.createElement('div');
    controlText.innerHTML = 'Find Coffee Shops';
    controlUI.appendChild(controlText);

    $('#map').on('click', '.search-btn', (e) => {
      const invalidInput = checkForInvalidInput()
      if (invalidInput === false) {
        calculateMidPoint()
      }
    })
  }
  
  function checkForInvalidInput() {
    if (($('.location1-search-field').val() === '') &&      ($('.location2-search-field').val() === '')) {
      $('.error-missing-location')[0].classList.remove('hide')
    } else if (($('.location1-search-field').val() === '') || ($('.location2-search-field').val() === '')) {
      $('.error-missing-location')[0].classList.remove('hide') 
    } else { return false }
  }
    
    function calculateMidPoint() {
      const invalidInput = checkForInvalidInput()
      if (invalidInput === false) {
        $('.no-results')[0].classList.add('hide')
        $('.error-missing-location')[0].classList.add('hide')
        const DEG_TO_RAD = Math.PI / 180;     // To convert degrees to radians.
        const latitude1 = localStorage.getItem('location1').split(',')[0].split(':')[1]
        const latitude2 = localStorage.getItem('location2').split(',')[0].split(':')[1]
        const longitude1 = localStorage.getItem('location1').split(',')[1].split(':')[1]
        const longitude2 = localStorage.getItem('location2').split(',')[1].split(':')[1]
        // Convert latitude and longitudes to radians:
        const lat1 = latitude1 * DEG_TO_RAD;
        const lat2 = latitude2 * DEG_TO_RAD;
        const lng1 = longitude1 * DEG_TO_RAD;
        const dLng = (longitude2 - longitude1) * DEG_TO_RAD;  // Diff in longtitude.
     
        // Calculate mid-point:
        const bx = Math.cos(lat2) * Math.cos(dLng);
        const by = Math.cos(lat2) * Math.sin(dLng);
        const latitude = Math.atan2(
            Math.sin(lat1) + Math.sin(lat2),
            Math.sqrt((Math.cos(lat1) + bx) * (Math.cos(lat1) + bx) + by * by));
        const longitude = lng1 + Math.atan2(by, Math.cos(lat1) + bx);
        const midPointLat = latitude / DEG_TO_RAD
        const midPointLng = longitude / DEG_TO_RAD
        localStorage.setItem('center', `${midPointLat},${midPointLng}`)
    
        const lat = Number(localStorage.getItem('center').split(',')[0])
        const lng = Number(localStorage.getItem('center').split(',')[1])
        const center = {lat: lat, lng: lng}
        map.setCenter(center)
        clearResults(markers)
  
        const request = {
          location: (center),
          radius: 900,
          type: ['cafe']
        }
        service.nearbySearch(request, callback);
      }
    }