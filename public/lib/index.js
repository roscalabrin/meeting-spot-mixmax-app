$(document).ready( () => {
  new Location()
})

class Location {
  constructor() {
    this.searchListener()
  }
  
  searchListener() {
    $('.search-locations').on('click', (e) => {
      const location1 = $('.location1-search-field').val()
      const location2 = $('.location2-search-field').val()
      const location1Formatted = this.formatAddress(location1)
      const location2Formatted = this.formatAddress(location2)
      this.findCoord("location1", location1Formatted)
      this.findCoord("location2", location2Formatted)
      this.midPoint()
    })
  }
  
  formatAddress(address) {
    const array = address.split(' ')
    const alteredArray = []
    for (var i = 0; i < array.length; i++) {
      alteredArray.push(array[i] + '+')
    }
    return alteredArray
  }
  
  findCoord(place, locationFormatted) {
  
    $.ajax({
      type: "GET",
      url: `https://maps.googleapis.com/maps/api/geocode/json?address=${locationFormatted}&key=${apiKey}`,
      success: data => success(place, data)
    })
    function success(place, data) {
      const response = data.results[0].geometry.location
      const coords = `lat:${response.lat}, lng:${response.lng}`
      localStorage.setItem(place, coords)
    }
  }
  
  midPoint() {
    // var midPoint = function(latitude1, longitude1, latitude2, longitude2) {
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
    const lat = Math.atan2(
        Math.sin(lat1) + Math.sin(lat2),
        Math.sqrt((Math.cos(lat1) + bx) * (Math.cos(lat1) + bx) + by * by));
    const lng = lng1 + Math.atan2(by, Math.cos(lat1) + bx);
    debugger
    // lat / DEG_TO_RAD
    // lng / DEG_TO_RAD
    const array = []
  }
  
}
