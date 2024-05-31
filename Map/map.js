// Mapbox Public Access Key
mapboxgl.accessToken = 'pk.eyJ1Ijoic291cmF2azQ1IiwiYSI6ImNsdW1sdjhvdTByeDYyb3A3YTNtaHVzd3MifQ.oTZ2wQC3PdHjnYw1Mlq4Lw';

// Initializing Map
var map = new mapboxgl.Map({
    // Map Cotainer ID
    container: 'map',
    // Mapbox Style URL
    style: 'mapbox://styles/souravk45/clun1ib95017701pi3lwe9qy5',
    zoom: 12.56, // Default Zoom
    center: [121.037, 14.332] // Default centered coordinate
});

// Search Places
var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    marker: true,
});
// Direction Form
var directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken
    })
    // Adding Search Places on Map
map.addControl(geocoder, 'top-left')


// Adding navigation control on Map
map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
// Map Loaded 
map.on('load', function() {

    // Search Places Result Event
    geocoder.on('result', function(event) {
        console.log(event.result);
        new Promise(function(resolve) {
            // Removing Previous Search Result Marker
            $('.marker').remove()
            resolve()
        }).then(() => {
            // Adding Marker to the place
            new mapboxgl.Marker($('<div class="marker"><i class="fa fa-map-marker-alt"></i></div>')[0])
                .setLngLat(event.result.geometry.coordinates)
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML(
                        `<div>${event.result.place_name}</div><small class='text-muted'>${parseFloat(event.result.center[0]).toLocaleString('en-US')}, ${parseFloat(event.result.center[1]).toLocaleString('en-US')}</small>`
                    )
                )
                .addTo(map)
        }).then(() => {
            $('.marker').click()
        })

    });
    geocoder.container.setAttribute('id', 'geocoder-search')
});


// Map Render Event Listener
map.on('render', () => {
    // Do Something here
});

function direction_reset() {
    directions.actions.clearOrigin()
    directions.actions.clearDestination()
    directions.container.querySelector('input').value = ''
}
$(function() {
    $('#get-direction').click(function() {
        // Adding Direction form and instructions on map
        map.addControl(directions, 'top-left');
        directions.container.setAttribute('id', 'direction-container')
        $(geocoder.container).hide()
        $(this).hide()
        $('#end-direction').removeClass('d-none')
        $('.marker').remove()

    })
    $('#end-direction').click(function() {
        direction_reset()
        $(this).addClass('d-none')
        $('#get-direction').show()
        $(geocoder.container).show()
        map.removeControl(directions)
    })

})