class Restaurant {
  constructor(Geojson) {
    this.Geojson = Geojson;
    this.storedData = JSON.parse(localStorage.getItem("restaurants"));
  }
  addReview(reviewText, reviewStars, featureId) {
    let review = {
      stars: +reviewStars,
      comment: reviewText,
    };
    if (!this.storedData) {
      fetch(this.Geojson)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          for (let i = 0; i < data.features.length; i++) {
            if (data.features[i].id == featureId) {
              data.features[i].properties.ratings.push(review);
              break;
            }
          }
          localStorage.setItem("restaurants", JSON.stringify(data));
          var updatedData = JSON.parse(localStorage.getItem("restaurants"));
          this.storedData = updatedData;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      for (let i = 0; i < this.storedData.features.length; i++) {
        if (this.storedData.features[i].id == featureId) {
          this.storedData.features[i].properties.ratings.push(review);
          break;
        }
      }
      localStorage.setItem("restaurants", JSON.stringify(this.storedData));
      this.storedData = JSON.parse(localStorage.getItem("restaurants"));
    }
  }
  storeRestaurant(latlang, newResName, place_id) {
    this.storedData = JSON.parse(localStorage.getItem("restaurants"));
    if (!this.storedData) {
      fetch(this.Geojson)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let newResIndex = data.features.length;
          let newResId = data.features.length + 1;
          data.features[newResIndex] = {
            geometry: {
              type: "Point",
              coordinates: [latlang.lng, latlang.lat],
            },
            type: "Feature",
            id: newResId,
            properties: {
              category: "restaurant",
              hours: "8am - 9:30pm",
              description:
                "A delicious array of pastries with many flavours, and fresh coffee in an snug restaurant. We're part of a larger chain of restaurants .",
              name: newResName,
              place_id: place_id,
              restaurantid: newResId,
              ratings: [
                {
                  stars: 1,
                  comment: "Good Resto.",
                },
              ],
            },
          };
          localStorage.setItem("restaurants", JSON.stringify(data));
          var updatedData = JSON.parse(localStorage.getItem("restaurants"));
          this.storedData = updatedData;
          return newResId;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      let newResIndex = this.storedData.features.length;
      let newResId = this.storedData.features.length + 1;
      this.storedData.features[newResIndex] = {
        geometry: {
          type: "Point",
          coordinates: [latlang.lng, latlang.lat],
        },
        type: "Feature",
        id: newResId,
        properties: {
          category: "restaurant",
          hours: "8am - 9:30pm",
          description:
            "A delicious array of pastries with many flavours, and fresh coffee in an snug restaurant. We're part of a larger chain of restaurants .",
          name: newResName,
          place_id: place_id,
          restaurantid: newResId,
          ratings: [
            {
              stars: 1,
              comment: "Good Restaurant",
            },
          ],
        },
      };
      localStorage.setItem("restaurants", JSON.stringify(this.storedData));
      this.storedData = JSON.parse(localStorage.getItem("restaurants"));

      return newResId;
    }
  }
  loadUpdatedRestaurantsData() {
    reInitializeMap(this.storedData);
  }
}
