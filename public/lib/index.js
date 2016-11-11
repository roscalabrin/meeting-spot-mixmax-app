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
      this.calculateDistance()
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
  
  calculateDistance() {
    
  }
  
}
