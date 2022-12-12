# Louisville Foreclosures
We downloaded and georeferenced foreclosure foreclosure sales results data from the [Jefferson Circuit Court Commissioner's Office](https://jeffcomm.org/past-results.html). Data will include the purchaser and purchase amount. The working title of the project is: "Foreclosures in Louisville, KY, 2016-2020"

User needs are to be able to parse through the data to display patterns of foreclosures by area and purchases by type of purchaser and/or by individual purchaser. This map is be designed for researchers like Michael and myself with interests in contemporary urban housing markets. The goal is to help researchers scope out patterns in the data and facilitate further research into the topic (a) within the city of Louisville and (b) across and between U.S. cities.

## Data
The foreclosure sale data is georeferenced to addresses which are displayed as point data and broken out by year. The interface will has a 3/4 screen displaying the map of Louisville and data layers. These year layers can be toggled between. The remaining 1/4 column will be populated with map details, legends, search bar, and data aggregate table. 

## Tech stack
The data was processed in QGIS using the georeferencing tools in MMQGIS. The data was exported as GeoJSON data in order to be be stored and loaded into the map. We used Leaflet to load in and visualize the data. The map interface itself was be built in HTML with Bootstrap and styled using CSS.

## What still needs to be done
1. Fire "click" event when search is completed (https://github.com/stefanocudini/leaflet-search/issues/298)
2. Clean up pop-up formatting (i.e. sale values are all formatted identically as $)
3. Populate table of highest-volume purchasers.

## Sources
- Data downloaded from [Jefferson County Circuit Court Commissioner's Office](https://www.jeffcomm.org/past-results.html)
- Data geocoded in QGIS using hte [MMQGIS](https://michaelminn.com/linux/mmqgis/) plugin and exported to GeoJSON files.
- Data visualized on GitHub Pages using [Bootstrap](https://getbootstrap.com/), [Leaflet](https://leafletjs.com/), and [Leaflet Control](https://opengeo.tech/maps/leaflet-search/) libraries. Adusted from [New Maps Plus](https://newmapsplus.github.io/map673/) course template. 
