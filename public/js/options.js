


$(document).ready(function() {
    // $.getScript('./main.js', function (){console.log(initializeMap)});

    var curMap = initializeMap();

    for (var i = 0; i < hotels.length; i++) {
        var hotel = hotels[i];
        $(`<option name="hotel" value="${hotel.id}"> ${hotel.name} </option>`).appendTo('#hotel-choices');     
    }

     for (var i = 0; i < restaurants.length; i++) {
        var restaurant = restaurants[i];
        $(`<option name="restaurant" value="${restaurant.id}"> ${restaurant.name} </option>`).appendTo('#restaurant-choices');     
    }

     for (var i = 0; i < activities.length; i++) {
        var activity = activities[i];
        $(`<option name="activity" value="${activity.id}"> ${activity.name} </option>`).appendTo('#activity-choices');     
    }

    $('.btn.hotelbtn').on('click', function(){
        var selection = $(this).siblings('select').find('option:selected').val();
        
        var selectedHotel = hotels.filter(function(hotel, index){
            return hotel.id === +selection;
        });

        var itinItem = `<div class="itinerary-item"><span class="title">${selectedHotel[0].name}</span> <button class="btn btn-xs btn-danger remove btn-circle">x</button></div>`

        $(itinItem).appendTo('.hotel-list');
        var placeId = selectedHotel[0].placeId
        
        drawMarker(curMap, 'hotel', places[placeId].location);
    });

    $('.btn.restaurantbtn').on('click', function(){
        var selection = $(this).siblings('select').find('option:selected').val();
        
        var selectedRestaurant = restaurants.filter(function(restaurant, index){
            return restaurant.id === +selection;
        });

        var itinItem = `<div class="itinerary-item"><span class="title">${selectedRestaurant[0].name}</span> <button class="btn btn-xs btn-danger remove btn-circle">x</button></div>`

        $(itinItem).appendTo('.restaurant-list');
    });

    $('.btn.activitybtn').on('click', function(){
        var selection = $(this).siblings('select').find('option:selected').val();
        
        var selectedActivity = activities.filter(function(activity, index){
            return activity.id === +selection;
        });

        var itinItem = `<div class="itinerary-item"><span class="title">${selectedActivity[0].name}</span> <button class="btn btn-xs btn-danger remove btn-circle">x</button></div>`

        $(itinItem).appendTo('.activity-list');
    });


})