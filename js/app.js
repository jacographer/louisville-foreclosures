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
  fetch("data/point-foreclosures-all.geojson")
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

  let attributeValue = "2020"; // Employed

  function drawMap(data) {
    // create Leaflet data layer and add to map
    var pointStyles = {
      radius: 5,
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
              color: "#ffffd4",
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

        // on clicking layer
        layer.on("click", function (e) {
          map.setView(e.latlng, 15);
          console.log(e);
        });
      },
    }).addTo(map);

    console.log(addresses);
    updateTable(addresses, "2020"); // build table
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
    console.log(buttonclick);
    if (!buttonclick) {
      modalWindow.className = "show";
      modalButton.style.backgroundColor = "darkgray";
      modalButton.innerHTML = "Less about foreclosure sales";
    } else if (buttonclick == true) {
      modalWindow.className = "hide";
      modalButton.style.backgroundColor = "lightgray";
      modalButton.innerHTML = "More about foreclosure sales";
    }
    buttonclick = !buttonclick;
  });

  function makeRandom(coord) {
    const sign = Math.random() < 0.5 ? -1 : 1;
    return Number(coord) + Math.random() * 0.0005 * sign;
  }

  function searchAddresses(v, addresses, results) {
    let returns = [];
    addresses.eachLayer(function (l) {
      const address = l.feature.properties.PROPERTY;
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
    addresses.eachLayer(function (l) {
      const address = l.feature.properties;
      if (l._leaflet_id == v) {
        map.setView(l.getLatLng(), 15);
        l.setStyle({
          color: "goldenrod",
          fillColor: "gold",
          weight: 2.5,
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
      const year = props["SALE_DATE"];

      // set the fill color of layer based on its value
      layer.setStyle({
        fillColor: getColor(year),
      });

      let tooltipInfo = "";
      if (props["PURCHASER"] == "WITHDRAWN") {
        tooltipInfo = `<b>${props["PROPERTY"]}</b><br><i>Sale Withdrawn</i>, ${props["SALE_DATE"]}.<br>A withdrawn foreclosure sale means that the lender canceled the judicial sale of the property.`;
      } else if (layer.feature.properties.PROPERTY) {
        tooltipInfo = `<b>${props["PROPERTY"]}</b><br>Date of Sale: ${
          props["SALE_DATE"]
        }<br> Sale Price: $${props["PURCHASE"].toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}<br>Purchaser: <i>${props["PURCHASER"]}</i>`;
      } else {
        tooltipInfo = `<b>Incomplete Sale Data</b><br><i>For some foreclosed properties, the data available through the courts is incomplete.</i>`;
      }
      layer.bindPopup(tooltipInfo, {
        sticky: true,
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

    // Take the top 5 purchasers
    const topPurchasers = sortedPurchasers.slice(0, 5);
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
        p.SALE_DATE.includes(year) &&
        !p.PURCHASER.includes("WITHDRAWN") &&
        !p.PURCHASER.includes("COUNTY OF JEFFERSON")
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
      return "#a6cee3";
    } else if (year.includes("2017") && attributeValue == 2017) {
      return "#1f78b4";
    } else if (year.includes("2018") && attributeValue == 2018) {
      return "#b2df8a";
    } else if (year.includes("2019") && attributeValue == 2019) {
      return "#33a02c";
    } else if (year.includes("2020") && attributeValue == 2020) {
      return "#fb9a99";
    } else {
      return "rgba(255, 255, 255, 0.05)";
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
