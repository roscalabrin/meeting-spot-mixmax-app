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
      this.findCoord(location1, location2)
    })
  }
  
  findCoord(location1, location2) {
    debugger
    $.ajax({
      type: "GET",
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address=3719+West26th+Ave+Denver+CO&key=',
      success: function(response) {
        var coord = response.results[0].geometry.location
        console.log(coord)
      }
    })
  }
}
