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
      return this.findCoord(location1, location2)
    })
  }
  
  findCoord(location1, location2) {
    debugger
    $.ajax({
      url: ''
      success:function(result){
        console.log(result)
      }
    })
  }
}