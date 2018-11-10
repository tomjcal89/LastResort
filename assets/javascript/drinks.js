//Declaring initial variables
var coordinates;
var lat;
var long;
var lat1;
var long1;

//function to randomize the restaurants based off locaiton
function randomizer(lat, long) {
    var queryURL = "https://developers.zomato.com/api/v2.1/search?lat=" + lat + "&lon=" + long + "&cuisines=268&radius=3200&sort=real_distance"
    $.ajax({
        url: queryURL,
        headers: {
            'Accept': 'application/json',
            'user-key': '3a3df368b2259dd907eb09bb356cf09d'
        },
        method: "GET"
    }).then(function (response) {
        console.log(response)

        // From the ajax response the HTML page will show a featured photo, the name of the restaurant, address, type of cusine, cost, and rating-text
        var resp_rest = response.restaurants;
        console.log(response);

        if (resp_rest.length === 0) {
            var featured = $("<img>");
            featured.addClass("image");
            featured.attr("src", "./assets/images/sad.png");
            featured.attr("width", "300px")
            $("#map-canvas").html(featured);
            $("#nothing").html("No locations nearby, please try again")
        };



        var i = resp_rest[Math.floor(Math.random() * resp_rest.length)];

        //changing the restaurant string to an int.
        var nlat = parseFloat(i.restaurant.location.latitude);
        var nlong = parseFloat(i.restaurant.location.longitude)
        var latLong = { lat: nlat, lng: nlong }

        //sending the random location to HTML
        $("#name").html("Name: " + i.restaurant.name);
        $("#add").html("Address: " + i.restaurant.location.address);
        $("#cost").html("Cost for 2: $" + i.restaurant.average_cost_for_two);
        $("#rating").html("Rating: " + i.restaurant.user_rating.rating_text);


        // GOOGLE MAPS STARTS HERE------------------------------

        var map;
        var marker;
        map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: latLong,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: false,
            streetViewControl: false,

        });

        console.log(map)
        //placing a marker on the google map
        marker = new google.maps.Marker({
            position: latLong,
            map: map,
            draggable: false

        });
        console.log(latLong)
        // GOOGLE MAPS END-------------------
    });
};

//Hiding features of the app
$("#featured, #name, #add, #cost, #cuisine, #rating, #map-canvas, #newLoc, #refresh, .card").hide();

//giving permision to use current location and showing features once location is determined
$("#current").on("click", function () {
    $("#featured, #name, #add, #cost, #cuisine, #rating, #map-canvas, #newLoc, #refresh, .card").show();
    $("#current, #searchTextField").hide();
    getLocation();
})

//getting current location
function getLocation() {
    navigator.geolocation.getCurrentPosition(showPosition);
}
//getting the your coordinates based off your location
function showPosition(position) {
    lat1 = position.coords.latitude;
    long1 = position.coords.longitude;
    coordinates = { lat: lat1, long: long1 };
    randomizer(lat1, long1);
}

//user input of location using google maps autocomplete feature
function initialize() {
    var input = document.getElementById('searchTextField');
    var autocomplete = new google.maps.places.Autocomplete(input);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();
        lat = place.geometry.location.lat()
        long = place.geometry.location.lng()
        randomizer(lat, long)
        $("#featured, #name, #add, #cost, #cuisine, #rating, #map-canvas, #newLoc, #refresh, .card").show();
        $("#current, #searchTextField").hide();
    });
}
google.maps.event.addDomListener(window, 'load', initialize);

//displaying a different restaurant if you dont like the one that is displayed
$("#newLoc").on("click", function () {
    //if you click "get current location", then randomize coordinates.lat and coordinates.long
    if (lat && long) {
        randomizer(lat, long);
    } else if (navigator.geolocation) {
        randomizer(coordinates.lat, coordinates.long);
    } else {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
});


//search a new location
$("#refresh").click(function () {
    location.reload()
});