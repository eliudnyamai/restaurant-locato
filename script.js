const mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#263c3f",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#6b9a76",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#38414e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#212a37",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9ca5b3",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#1f2835",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#f3d19c",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#2f3948",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#515c6d",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
];


function showStoresList(data, stores) {
  if (stores.length == 0) {
    console.log("empty stores");
    return;
  }

  let panel = document.createElement("div");
  // If the panel already exists, use it. Else, create it and add to the page.
  if (document.getElementById("panel")) {
    panel = document.getElementById("panel");
    // If panel is already open, close it
    if (panel.classList.contains("open")) {
      panel.classList.remove("open");
    }
  } else {
    panel.setAttribute("id", "panel");
    const body = document.body;
    body.insertBefore(panel, body.childNodes[0]);
  }

  // Clear the previous details
  while (panel.lastChild) {
    panel.removeChild(panel.lastChild);
  }

  stores.forEach((store) => {
    // Add store details with text formatting
    const name = document.createElement("p");
    name.classList.add("place");
    const currentStore = data.getFeatureById(store.storeid);
    name.textContent = currentStore.getProperty("name");
    panel.appendChild(name);
    const distanceText = document.createElement("p");
    distanceText.classList.add("distanceText");
    distanceText.textContent = store.distanceText;
    panel.appendChild(distanceText);
  });

  // Open the panel
  panel.classList.add("open");

  return;
}
function initMap() {
  // Create the map.
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13.5,
    center: { lat: -1.2085711, lng: 36.900340899999996 },
    styles: mapStyle,
  });
 
  const apiKey = "AIzaSyBYoyXksTGzLnjJoSolEDmjQf53Ugt-6Rs";
  const infoWindow = new google.maps.InfoWindow();
 
  //display the user location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log(pos);

 map.data.loadGeoJson('restaurants.json', {}, function(features) {
    console.log("Logging the data features:");
    // note that there is no map.data.features property, but the callback returns the array of added features
    console.log(features);
    console.log("Using map.data.forEach:");
    map.data.forEach(function(feature) {
      console.log(feature);
    });
  });



        //infoWindow.setPosition(pos);
        // infoWindow.setContent("Location found.");
        infoWindow.open(map);
        map.setCenter(pos);
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
  //});

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }
 
  // Show the information for a store when its marker is clicked.
  map.data.addListener("click", (event) => {
    const category = event.feature.getProperty("category");
    const name = event.feature.getProperty("name");
    const description = event.feature.getProperty("description");
    const hours = event.feature.getProperty("hours");
    const phone = event.feature.getProperty("phone");
    const position = event.feature.getGeometry().get();
    const content = `
      <img style="float:left; width:200px; margin-top:30px" src="img/logo_${category}.png">
      <div style="margin-left:220px; margin-bottom:20px;">
        <h2>${name}</h2><p>${description}</p>
        <p><b>Open:</b> ${hours}<br/><b>Phone:</b> ${phone}</p>
        <p><img src="https://maps.googleapis.com/maps/api/streetview?size=350x120&location=${position.lat()},${position.lng()}&key=${apiKey}"></p>
      </div>
    `;

    infoWindow.setContent(content);
    infoWindow.setPosition(position);
    infoWindow.setOptions({ pixelOffset: new google.maps.Size(0, -30) });
    infoWindow.open(map);
  });
  // Build and add the search bar
  const card = document.createElement("div");
  const titleBar = document.createElement("div");
  const title = document.createElement("div");
  const container = document.createElement("div");
  const input = document.createElement("input");
  const options = {
    types: ["address"],
    componentRestrictions: { country: "ke" },
  };
  card.setAttribute("id", "pac-card");
  title.setAttribute("id", "title");
  title.textContent = "Find the nearest store";
  titleBar.appendChild(title);
  container.setAttribute("id", "pac-container");
  input.setAttribute("id", "pac-input");
  input.setAttribute("type", "text");
  input.setAttribute("placeholder", "Enter an address");
  container.appendChild(input);
  card.appendChild(titleBar);
  card.appendChild(container);
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card); 
}
