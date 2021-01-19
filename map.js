class CreateMap {
  constructor(avg, Geojson) {
    this.avg = avg;
    this.Geojson = Geojson;
    this.infoWindow = new google.maps.InfoWindow();
    this.map = new google.maps.Map(document.getElementById("map"), {
      zoom: 13.5,
      center: { lat: -3.2085711, lng: 56.900340899999996 },
       styles: mapStyle,
      mapTypeControl: false,
    });

    this.mapData = this.map.data;
    this.avgstars = $("#restaurant-filter").val();
  }

  addRestaurant() {
    let infoWindow = new google.maps.InfoWindow({});
    this.map.addListener("click", (mapsMouseEvent) => {
      infoWindow.close();
      var latlang = mapsMouseEvent.latLng.toJSON();
      infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      });
      const content = `
                      <div class="row">
                        <div class="col">
                          <h6 class="title text-center">Add A New Restaurant</h6>
                          <div class="form-group">
                                <input type="text" hidden class="form-control" value="${latlang.lat}"  id="lat">
                                <input type="text" hidden class="form-control" value="${latlang.lng}"  id="lng">
                              </div>
                          <input type="text" id="res-name" class="form-control" placeholder="Enter restaurant name">
                          <div class="col text-center">
                          <button id="add-restaurant" class="btn btn-sm mt-2 p-1 btn-success">Add Restaurant</button>
                        </div>
                        </div>
                      </div>
                      `;
      infoWindow.setContent(content);
      infoWindow.open(this.map);
    });
  }

  loadData(Geojson) {
    let features = this.mapData.addGeoJson(Geojson);
    document.getElementById("restaurant-list").innerHTML = "";
    features.forEach((feature) => {
      let ratingsArray = feature.getProperty("ratings");
      let restaurantsToDisplay = +this.avgstars;
      let f = feature;
      let avg = getReviews(ratingsArray, f).avg;
      filter_restaurants(restaurantsToDisplay, avg, this.mapData, f);
    });
  }

  setMarkerStyle() {
    this.map.data.setStyle((feature) => {
      return {
        icon: {
          url: `img/marker3.png`,
          scaledSize: new google.maps.Size(64, 64),
        },
      };
    });
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
           var marker = new google.maps.Marker({
             map: this.map,
             position: pos,
             title:"Your Location"
           });
          this.infoWindow.setPosition(pos);
          this.infoWindow.setContent("Your Location");
          this.infoWindow.open(this.map);
          this.map.setCenter(pos);
          this.displayRestaurantsFromGoogleMaps();
        },
        () => {
          this.handleLocationError(true, this.infoWindow, this.map.getCenter());
        }
      );
    } else {
      this.handleLocationError(false, this.infoWindow, this.map.getCenter());
    }
    
  }
handleLocationError(browserHasGeolocation, infoWindow, pos) {
      this.infoWindow.setPosition(pos);
      this.infoWindow.setContent(
        browserHasGeolocation
          ? "Error: The Geolocation service failed."
          : "Error: Your browser doesn't support geolocation."
      );
      this.infoWindow.open(this.map);
    }
  displayRestaurantInfo() {
    // Show the information for a store when its marker is clicked.
    this.map.data.addListener("click", (event) => {
      const apiKey = "your api key";
      const name = event.feature.getProperty("name");
      const position = event.feature.getGeometry().get();
      const ratings = event.feature.getProperty("ratings");
      let comments = getReviews(ratings, event.feature).comments;
      let avg = getReviews(ratings, event.feature).avg;
      var size = Math.max(0, Math.min(5, avg)) * 23.5;
      let featureId = event.feature.getId();
      const content = `
                <figure style="float:left; " >
                <img class="res-icon"  src="img/res.png">
                <figcaption>Rating: ${avg} Stars <br>
                <span style='width: ${size}' class='stars'></span> <br>
                <button id="review-button" type="button" class="btn btn-success p-1 mt-3" 
                data-toggle="modal" data-target="#reviewModal" data-whatever="${featureId}">Add Review</button>
                </figcaption>
                </figure>
                <div class="res-info">
                  <div class="">
                  <h6>${name} Reviews</h6>${comments}
                  </div>
                </div>
                <p><img class="google-img" src="https://maps.googleapis.com/maps/api/streetview?size=400x210&location=${position.lat()},${position.lng()}&key=${apiKey}"></p>
    `;
      this.infoWindow.setContent(content);
      this.infoWindow.setPosition(position);
      this.infoWindow.setOptions({ pixelOffset: new google.maps.Size(0, -30) });
      this.infoWindow.open(this.map);
    });
  }

  buildautocompleteSearchbar() {
    const card = document.createElement("div");
    const titleBar = document.createElement("div");
    const title = document.createElement("div");
    const container = document.createElement("div");
    const input = document.createElement("input");
    const options = {
      type: ["restaurant"],
      componentRestrictions: { country: "ke" },
    };
    card.setAttribute("id", "pac-card");
    title.setAttribute("class", "title");
    title.textContent = "Find the nearest restaurant";
    titleBar.appendChild(title);
    container.setAttribute("id", "pac-container");
    input.setAttribute("id", "pac-input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Enter an address");
    container.appendChild(input);
    card.appendChild(titleBar);
    card.appendChild(container);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);
    const autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.setFields([
      "address_components",
      "geometry",
      "name",
      "place_id",
    ]);
    // Set the origin point when the user selects an address
    const originMarker = new google.maps.Marker({ map: map });
    originMarker.setVisible(false);
    let originLocation = this.map.getCenter();
    autocomplete.addListener("place_changed", async () => {
    originMarker.setVisible(false);
    originLocation = this.map.getCenter();
    const place = autocomplete.getPlace();
    if (!place.geometry) {
        window.alert("No address available for input: '" + place.name + "'");
        return;
    }
    // Recenter the map to the selected address
      originLocation = place.geometry.location;
      console.log(originLocation)
      this.map.setCenter(originLocation);
      this.map.setZoom(13.5);
      originMarker.setPosition(originLocation);
      originMarker.setVisible(true);
      this.displayRestaurantsFromGoogleMaps();
      return;
    });
  }

  displayRestaurantsFromGoogleMaps() {
    let storedData = JSON.parse(localStorage.getItem("restaurants"));
    var place_ids=[];
    if(storedData){//get place_ids of all places we already have
      for (let i = 0; i < storedData.features.length; i++) {
          place_ids.push(storedData.features[i].properties.place_id);
          }
          console.log(place_ids);
    }
    console.log(this.map.getCenter().lat())
    var request = {
      location: this.map.getCenter(),
      radius: 5000,
      types: ["restaurant"],
      fields: ["name", "geometry"],
    };
    var service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch(request, (results) => {
      results.forEach((result) => {
        let plac = result.place_id;
        var request = {
          placeId: plac, 
        };
        if (!place_ids.includes(plac)) {//only get details of a place we do not have
          getGooglePlaceDetails(service, request);
          place_ids.push(plac)
        } 
      });
    });
  }
}
