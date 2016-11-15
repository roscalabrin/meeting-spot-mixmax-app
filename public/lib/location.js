class SetLocation {
  constructor(name, location) {
    this.name = name
    this.location = location
    this.findGeolocation()
  }
  
  findGeolocation() {
    const locationFormatted = this.formatAddress(this.location)
    this.findCoord(this.name, locationFormatted)
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
    const apiKey = 'AIzaSyBpLUwZpzkUP48Yz_9WWbly35G7W-8YiN8'
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
}  