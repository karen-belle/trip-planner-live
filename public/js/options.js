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


    function addToItinerary(selection, array, categoryStr, list) {
        var selected = array.filter(function(element) {
            return element.id === +selection;
        });
        //create new element and append to DOM
        var itinItem = `<div class="itinerary-item" data-type="${categoryStr}"><span class="title">${ selected[0].name}</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>`
        $(itinItem).appendTo(list);

        //get coords obj for selected place
        var location = places[selected[0].placeId - 1].location

        //draw the associated marker on map
        var marker = drawMarker(curMap, categoryStr, location, name);
        curMap.setCenter(new google.maps.LatLng(location[0], location[1]));

        //add the item to current day
        var day = currentDayTitle();
        allDays[day][categoryStr].push({ item: selected[0], location: location, marker: marker });
    };

    function currentDayTitle(){
        return "day" + $('.current-day').text();
    }


    //REMOVING AN ITEM FROM ITINERARY AND CORRESPONDING MARKER FROM MAP
    $('.list-group').on('click', '.btn.remove', function() {
        var selected = $(this).parent('.itinerary-item')

        var name = $(selected).find('.title').text()
        selected.remove();

        var day = currentDayTitle();
        var category = $(selected).attr("data-type");
        allDays[day][category].forEach(function(elem, index) {
            if (elem.item.name === name) {
                elem.marker.setMap(null);
                allDays[day][category].splice(index, 1);
            }
        })
        console.log(allDays[day]);
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
        switchDays(this);
    });

    function switchDays(dayToSwitchTo) {
        var prevDay = $('.current-day').text();
        var number = Number($(dayToSwitchTo).text());
        if (!isNaN(number)) {
            $('.day-btn').removeClass('current-day')
            $(dayToSwitchTo).addClass('current-day');
            $('#day-title span').text('Day ' + number);
            $('.list-group').empty();

            console.log("switchDays should be deleted day", allDays['day' + prevDay]);

            for (var key in allDays['day' + prevDay]) {
                for (var item in allDays['day' + prevDay][key]) {
                    allDays['day' + prevDay][key][item].marker.setMap(null);
                }
            }

            for (var key in allDays['day' + number]) {
                allDays['day' + number][key].forEach(function(element, index) {
                    var itinItem = `<div class="itinerary-item" data-type="${key}"><span class="title">${element.item.name}</span><button class="btn btn-xs btn-danger remove btn-circle">x</button></div>`
                    var list = '.' + key + '-list';

                    $(itinItem).appendTo(list);
                    element.marker.setMap(curMap);
                });
            }
        }
    }

    //REMOVE A DAY
    $('#day-title .remove').on('click', function() {
        var curNum = Number($('.current-day').text());
        var lastNum = +$('.day-buttons .btn').not('#day-add').last().text();

        if (lastNum !== curNum) //it's not the last day, time to shift
        {
            //update button numbers
            $('.current-day').nextAll().not('#day-add').each(function() {
                $(this).text(Number($(this).text()) - 1);
            })
            //set curday to the number of the current day (for while loop)
            var curDay = curNum;
            var newCurrent = $('.current-day').next();
            // console.log(newCurrent); //new current day should be the next day
        }
        //if there is not a next day (this is the last day) the new current day should be the previous day
        if(!newCurrent) var newCurrent = $('.current-day').prev();
        

        //switch days using the new current day as 'this' and then remove that day button
        var currentDayToRemove = $('.current-day');
        switchDays(newCurrent);
        currentDayToRemove.remove();

        //for each day reassign the current day in the obj to the next
        while (lastNum - curDay > 0) {
            allDays['day' + curDay] = allDays['day' + (curDay + 1)];
            curDay++;
        }
        // console.dir(allDays)
        delete allDays['day' + lastNum]; //delete the last day (a duplicate at this point)
        console.dir(allDays)

        //change the day title to the 'next' (now current day) or last day
        // var dayNum = lastNum === curNum ? curNum - 1 : curNum;
        // $('#day-title span').text('Day ' + (dayNum));

    })
})
