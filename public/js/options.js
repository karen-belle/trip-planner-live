$(document).ready(function() {
    // $.getScript('./main.js', function (){console.log(initializeMap)});

    var curMap = initializeMap();
    var allDays = {
        day1: {
            hotel: [],
            restaurant: [],
            activity: []
        }
    };


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

    //ADDING AN ITEM TO ITINERARY AND CORRESPONDING MARKER TO MAP
    $('.btn.hotelbtn').on('click', function() {
        var selection = $(this).siblings('select').find('option:selected').val();
        addToItinerary(selection, hotels, 'hotel', '.hotel-list')
    });

    $('.btn.restaurantbtn').on('click', function() {
        var selection = $(this).siblings('select').find('option:selected').val();
        addToItinerary(selection, restaurants, 'restaurant', '.restaurant-list')
    });

    $('.btn.activitybtn').on('click', function() {
        var selection = $(this).siblings('select').find('option:selected').val();
        addToItinerary(selection, activities, 'activity', '.activity-list')
    });

    //REMOVING AN ITEM FROM ITINERARY AND CORRESPONDING MARKER TO MAP
    $('.list-group').on('click', '.btn.remove', function() {
        var selected = $(this).parent('.itinerary-item')

        var name = $(selected).find('.title').text()
            // markers[name].setMap(null);
        selected.remove();

        var dayNum = "day" + $('.current-day').text();
        var category = $(selected).attr("data-type");
        allDays[dayNum][category].forEach(function(elem, index) {
                if (elem.item.name === name) {
                    elem.marker.setMap(null);
                    allDays[dayNum][category].splice(index, 1);
                }
            })
            console.log(allDays[dayNum]);
    });

    //ADD DAY
    $('#day-add').on('click', function() {
        var newDayNum = +($(this).prev().text()) + 1;
        var daybutton = `<button class="btn btn-circle day-btn">${newDayNum}</button>`
        $(this).before(daybutton);

        allDays["day" + newDayNum] = {
            hotel: [],
            restaurant: [],
            activity: []
        }
    })

    //SWITCH DAYS
    $('.day-buttons').on('click', '.day-btn', function() {
        var prevDay = $('.current-day').text();
        var number = Number($(this).text());
        if (!isNaN(number)) {
            $('.day-btn').removeClass('current-day')
            $(this).addClass('current-day');
            $('#day-title span').text('Day ' + number);
            $('.list-group').empty();

            for(var key in allDays['day' + prevDay]){
                for(var item in allDays['day' + prevDay][key]){
                    allDays['day' + prevDay][key][item].marker.setMap(null);
                }
            }
              for(var key in allDays['day' + number]){
                allDays['day'+number][key].forEach(function(element, index){
                    var itinItem = `<div class="itinerary-item" data-type="${key}"><span class="title">${element.item.name}</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>`
                    var list = '.'+key +'-list';
                    
                    $(itinItem).appendTo(list);

                    drawMarker(curMap, key, element.location, element.item.name);
                    curMap.setCenter(new google.maps.LatLng(element.location[0], element.location[1]));

                });
            }
        }

    });



    function addToItinerary(selection, array, categoryStr, list) {
        var selected = array.filter(function(element) {
            return element.id === +selection;
        });
        var name = selected[0].name

        var itinItem = `<div class="itinerary-item" data-type="${categoryStr}"><span class="title">${name}</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>`

        $(itinItem).appendTo(list);

        var placeId = selected[0].placeId
        var location = places[placeId - 1].location

        var marker = drawMarker(curMap, categoryStr, location, name);
        curMap.setCenter(new google.maps.LatLng(location[0], location[1]));
        //console.log(marker);

        var dayNum = "day" + $('.current-day').text();
        allDays[dayNum][categoryStr].push({ item: selected[0], location:location, marker: marker });
        //allDays[dayNum].markers.push(marker);
        console.log(allDays[dayNum]);
    };




})
