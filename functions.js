
function filter_restaurants(avgstars,avg,mapData,feature){
     switch (avgstars) {
       case 1:
         if (avg >= 1 && avg <= 2) {
            var size = Math.max(0, Math.min(5, avg)) * 23.5;
            document.getElementById("restaurant-list").innerHTML +=
              "<div class='restaurant'>" +
              feature.getProperty("name") +
              "<br>" +
              "<span style='width:" +
              size +
              "' class='stars'></span>" +
              "<span >Avg rating of " +
              avg +
              "</span>" +
              "</div>";
         } else {
           mapData.remove(feature);
         }
         break;
       case 2:
         if (avg >= 2 && avg <= 3) {
            var size = Math.max(0, Math.min(5, avg)) * 23.5;
            document.getElementById("restaurant-list").innerHTML +=
              "<div class='restaurant'>" +
              feature.getProperty("name") +
              "<br>" +
              "<span style='width:" +
              size +
              "' class='stars'></span>" +
              "<span >Avg rating of " +
              avg +
              "</span>" +
              "</div>";
         } else {
           mapData.remove(feature);
         }
         break;
       case 3:
         if (avg >= 3 && avg <= 4) {
          var size = Math.max(0, Math.min(5, avg)) * 23.5;
          document.getElementById("restaurant-list").innerHTML +=
            "<div class='restaurant'>" +
            feature.getProperty("name") +
            "<br>" +
            "<span style='width:" +
            size +
            "' class='stars'></span>" +
            "<span >Avg rating of " +
            avg +
            "</span>" +
            "</div>";
         } else {
           mapData.remove(feature);
         }
         break;
       case 4:
         if (avg >= 4 && avg <= 5) {
         var size = Math.max(0, Math.min(5, avg)) * 23.5;
         document.getElementById("restaurant-list").innerHTML +=
           "<div class='restaurant'>" +
           feature.getProperty("name") +
           "<br>" +
           "<span style='width:" +
           size +
           "' class='stars'></span>" +
           "<span >Avg rating of " +
           avg +
           "</span>" +
           "</div>";
         } else {
           mapData.remove(feature);
         }
         break;
       default:
           var size = Math.max(0, Math.min(5, avg)) * 23.5;
         document.getElementById("restaurant-list").innerHTML +=
           "<div class='restaurant'>" +
           feature.getProperty("name") +
           "<br>" +
           "<span style='width:" +
           size +
           "' class='stars'></span>" +
           "<span >Avg rating of " +
           avg +
           "</span>" +
           "</div>";
        
     }
    
}
function getReviews(ratingsArray,feature) {
  let ratingsSum = 0;
  let x = 0;
  let comments="";
  ratingsArray.forEach((rating) => {
    ratingsSum += feature.getProperty("ratings")[x].stars;
     comments += "<p><q>" + feature.getProperty("ratings")[x].comment; + "</q></p><br>";
    x++;
  });
  let avg = ratingsSum / ratingsArray.length;
  avg = +avg.toFixed(2);
  return {avg,comments};
}

function initialize_map(data) {
   map = new CreateMap();
   map.loadData(data);
   map.buildautocompleteSearchbar();
   map.setMarkerStyle();
   map.getUserLocation();
   map.displayRestaurantInfo();
   map.addRestaurant();
}
function reInitializeMap(data) {
   map.loadData(data);
}
function getGooglePlaceDetails(service,request){
   service.getDetails(request, function (place, status) {
     if (status == google.maps.places.PlacesServiceStatus.OK) {
       if (place.reviews !== undefined) {
         let lat = place.geometry.location.lat();
         let lng = place.geometry.location.lng();
         let newResName = place.name;
         let reviews = place.reviews;
         let latlang = { lng, lat };
         var restaurant = new Restaurant("restaurants.json");
         let featureId = restaurant.storeRestaurant(latlang, newResName,place.place_id);
         reviews.forEach((review) => {
           let reviewText = review.text;
           let reviewStars = review.rating;
           restaurant.addReview(reviewText, reviewStars, featureId);
         });
         restaurant.loadUpdatedRestaurantsData();
       }
     }
   });
}

function createNewRestaurantEntry(restaurants,latlang,newResName,place_id) {
   let resId = restaurants.features.length + 1;
   let resIndex = restaurants.features.length;
   data.features[resIndex] = {
     geometry: {
       type: "Point",
       coordinates: [latlang.lng, latlang.lat],
     },
     type: "Feature",
     id: resId,
     properties: {
       category: "restaurant",
       hours: "8am - 9:30pm",
       description:
         "A delicious array of pastries with many flavours, and fresh coffee in an snug restaurant. We're part of a larger chain of restaurants .",
       name: newResName,
       phone: place_id,
       restaurantid:resId,
       ratings: [
         {
           stars: 3,
           comment: "Great! But not many veggie options.",
         },
         {
           stars: 5,
           comment: "My favorite restaurant!",
         },
         {
           stars: 5,
           comment: "Nice Waiters!",
         },
       ],
     },
   };
   return {restaurants,resId};
}