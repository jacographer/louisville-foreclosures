(function () {
  // initial Leaflet map options
  const options = {
    zoomSnap: 1,
    center: [38.22, -85.775],
    zoom: 11.5,
    minZoom: 10,
    maxZoom: 17,
    zoomControl: false,
  };
  // create Leaflet map and apply options
  const map = L.map("map", options);
  new L.control.zoom({
    position: "bottomright",
  }).addTo(map);

  // request a basemap tile layer and add to the map
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // fetch data from a remote source
  fetch("data/6_jeffco_points.geojson")
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    })
    .then(function (data) {
      console.log(data);
      // call draw map and send data as parameter
      drawMap(data);
    });

  let attributeValue = "2022"; // set 2022 as starting value

  function drawMap(data) {
    // create Leaflet data layer and add to map
    var pointStyles = {
      radius: 6,
      fillColor: "#ff7800",
      color: "rgba (0,0,0,0)",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.9,
    };
    const addresses = L.geoJson(data, {
      // style counties with initial default path options
      pointToLayer: function (feature, latlng) {
        latlng = [makeRandom(latlng.lat), makeRandom(latlng.lng)];
        return L.circleMarker(latlng, pointStyles);
      },

      // add hover/touch functionality to each feature layer
      onEachFeature: function (feature, layer) {
        // when mousing over a layer
        layer.on("mouseover", function () {
          // change the stroke color and bring that element to the front
          layer
            .setStyle({
              color: "white",
              weight: 2,
            })
            .bringToFront();
        });

        // on mousing off layer
        layer.on("mouseout", function () {
          // reset the layer style to its original stroke color
          layer.setStyle({
            color: "rgba (0,0,0,0)",
          });
        });

        // // on clicking layer
        // layer.on("click", function (e) {
        //   map.panTo(e.latlng);
        //   console.log(e);
        // });
      },
    }).addTo(map);

    console.log(addresses);
    updateTable(addresses, "2022"); // build table
    addUi(addresses); // add the UI controls
    updateMap(addresses); // draw the map

    const search = document.querySelector("#search-bar");
    const results = document.querySelector("#search-results select");
    search.addEventListener("input", function (e) {
      if (e.target.value.length > 3) {
        searchAddresses(e.target.value, addresses, results);
        results.className = "show";
      } else {
        results.className = "hide";
      }
    });
    results.addEventListener("input", function (e) {
      zoomTo(e.target.value, addresses);
    });
  }

  const modalButton = document.getElementById("modalButton");
  const modalWindow = document.getElementById("infoModal");
  let buttonclick = false;
  modalButton.addEventListener("click", function () {
    // console.log(buttonclick);
    if (!buttonclick) {
      modalWindow.className = "show";
      modalButton.style.color = "gold";
      modalButton.style.borderColor = "gold";
      modalButton.innerHTML = "Less about foreclosure sales";
    } else if (buttonclick == true) {
      modalWindow.className = "hide";
      modalButton.style.color = "white";
      modalButton.style.borderColor = "white";
      modalButton.innerHTML = "More about foreclosure sales";
    }
    buttonclick = !buttonclick;
  });

  function makeRandom(coord) {
    const sign = Math.random() < 0.5 ? -1 : 1;
    return Number(coord) + Math.random() * 0.0001 * sign;
  }

  function searchAddresses(v, addresses, results) {
    let returns = [];
    addresses.eachLayer(function (l) {
      const address = l.feature.properties.CLEAN;
      if (address.toLowerCase().includes(v.toLowerCase())) {
        returns.push([address, l._leaflet_id]);
      }
    });
    returns.sort();
    returns = returns.map(function (r) {
      return `<option value="${r[1]}">${r[0]}</option>`;
    });
    if (returns.length == 0) {
      returns.push(`<option>No results</option>`);
    }
    results.innerHTML = "<option>Select from below...</option>";
    results.innerHTML += `${returns.join("\n")}`;
  }

  function zoomTo(v, addresses) {
    updateMap(addresses);
    addresses.eachLayer(function (l) {
      const address = l.feature.properties;
      if (l._leaflet_id == v) {
        map.setView(l.getLatLng(), 14);
        l.setStyle({
          fillColor: "gold",
          fillOpacity: 1,
          color: "none",
          radius: 8,
          // weight: 2
        });
        l.openPopup();
      }
    });
  }

  function updateMap(addresses) {
    console.log(addresses);

    // loop through each address layer to update the color and tooltip info
    addresses.eachLayer(function (layer) {
      const props = layer.feature.properties;
      const year = props["DATE"];

      // set the fill color of layer based on its value
      layer.setStyle({
        radius: 6,
        fillOpacity: 0.9,
        color: "none",
        fillColor: getColor(year)
      });

      let tooltipInfo = "";
      if (props["PURCHASER"] == props["PLAINTIFF"]) {
        tooltipInfo = `<b>${props["CLEAN"]}</b><br><u>Date of Sale</u>: ${
          props["DATE"]
        }<br> <u>Sale Price</u>: $${props["BID"].toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}<br><u>Forecloser (Default)</u>: ${props["PLAINTIFF"]}`;
      } else if (layer.feature.properties.CLEAN) {
        tooltipInfo = `<b>${props["CLEAN"]}</b><br><u>Date of Sale</u>: ${
          props["DATE"]
        }<br> <u>Sale Price</u>: $${props["BID"].toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}<br><u>Forecloser</u>: ${props["PLAINTIFF"]}<br><u>Purchaser</u>: ${props["PURCHASER"]}`;
      } else {
        tooltipInfo = `<b>Incomplete Sale Data</b><br>For some foreclosed properties, the data available through the courts is incomplete.`;
      }
      layer.bindPopup(tooltipInfo, {
        sticky: true,
        maxWidth: 250,
      });
    });
  }

  function updateTable(addresses, year) {
    // Get the table body element
    const tableBody = document.querySelector("#top-purchasers-table tbody");
    // Clear the table body
    tableBody.innerHTML = "";
    // Get the current count of purchasers for the given year
    const purchaserCount = getPurchaserCount(addresses, year);
    // Sort the purchaser counts in descending order
    const sortedPurchasers = Object.entries(purchaserCount).sort(
      (a, b) => b[1] - a[1]
    );

    // Take the top 10 purchasers
    const topPurchasers = sortedPurchasers.slice(0, 10);
    // Create a row for each purchaser
    const rows = topPurchasers.map(([name, count]) => {
      // Create a new table row element
      const row = document.createElement("tr");
      // Create a new table cell element for the name
      const nameCell = document.createElement("td");
      nameCell.textContent = name;
      // Create a new table cell element for the count
      const countCell = document.createElement("td");
      countCell.textContent = count;

      nameCell.addEventListener("click", function () {
        updateMap(addresses);
        map.flyTo([38.2, -85.7], 10);
        addresses.eachLayer(function (layer) {
          if(layer.feature.properties.PURCHASER == name && layer.feature.properties.DATE.includes(year)){
            layer.bringToFront(),
            layer.setStyle({
              fillColor: "gold",
              fillOpacity: 1,
              color: "none",
              radius: 8,
              // weight: 2
            });
        // nameCell.style.color = "blue";
        } else {
          layer.setStyle({
            fillOpacity: 0.3
          })
        }
        })
      });

      // Append the cells to the row
      row.appendChild(nameCell);
      row.appendChild(countCell);
      return row;

    });
    // Append the rows to the table body
    rows.forEach((row) => tableBody.appendChild(row));
  }

  function getPurchaserCount(addresses, year) {
    const purchaserCounts = {};
    addresses.eachLayer(function (layer) {
      const p = layer.feature.properties;
      // Handle cases where the purchaser is null
      if (p.PURCHASER == null) {
        p.PURCHASER = "UNKNOWN";
      }
      if (
        p.PURCHASER != p.PLAINTIFF &&
        p.DATE.includes(year) &&
        !p.PURCHASER.includes("SOLD AS A WHOLE")
        
      ) {
        // Get the name of the purchaser
        const name = p.PURCHASER;
        // If the name is not yet in the dictionary, add it with a count of 0
        if (!purchaserCounts[name]) {
          purchaserCounts[name] = 0;
        }
        // Increment the count for the purchaser by 1
        purchaserCounts[name] += 1;
      }
    });
    // Return the dictionary of purchaser names and counts
    return purchaserCounts;
    console.log(purchaserCounts); // log the dictionary of purchaser names and counts
  }

  // Get color of county
  function getColor(year) {
    if (year.includes("2016") && attributeValue == 2016) {
      return "#1b9e77";
    } else if (year.includes("2017") && attributeValue == 2017) {
      return "#d95f02";
    } else if (year.includes("2018") && attributeValue == 2018) {
      return "#7570b3";
    } else if (year.includes("2019") && attributeValue == 2019) {
      return "#e7298a";
    } else if (year.includes("2020") && attributeValue == 2020) {
      return "#66a61e";
    } else if (year.includes("2021") && attributeValue == 2021) {
      return "#e6ab02";
    } else if (year.includes("2022") && attributeValue == 2022) {
      return "#a6761d";
    } else if (year.includes("20") && attributeValue == 20) {
        return "rgba(255, 255, 255, 0.5)";
    // } else {
    //   return "rgba(255, 255, 255, 0.05)";
    }
  }

  function addUi(addresses) {
    const dropdown = document.querySelector("#dropdown-ui select");
    dropdown.addEventListener("change", function (e) {
      // get the value of the selected option
      attributeValue = e.target.value;
      this.style.backgroundColor = getColor(attributeValue);
      // update the map
      updateMap(addresses);
      updateTable(addresses, attributeValue); // attributeValue = year
    });
  }
})();
