# Louisville Foreclosures

## Live URL
http://jacographer.com/louisville-foreclosures/

## Background
To be written...

## Purpose
Our goal is for users to be able to visualize patterns of foreclosure by area, and to search through the data by address. This map is designed for researchers like Michael and myself with interests in contemporary urban housing markets and trends. The goal is to help researchers scope out patterns in the data and facilitate further research into the topic (a) within the city of Louisville and (b) across and between U.S. cities.

## Process
We downloaded and georeferenced foreclosure foreclosure sales results data from the [Jefferson Circuit Court Commissioner's Office](https://jeffcomm.org/past-results.html). Data includes the address, sale date, purchaser and purchase amount.

Immportantly, not all sales were able to be successfully georeferenced. As a result, the data is not comprehensive, yet still representative of spatial trends and major purchasers.

## Tech stack
The data was processed in QGIS using the georeferencing tools in MMQGIS. The data was exported as GeoJSON data in order to be be stored and loaded into the map. We used Leaflet to load in and visualize the data. The map interface itself was be built in HTML with Bootstrap and styled using CSS.

## Sources
- Data downloaded as Excel spreadsheet from [Jefferson County Circuit Court Commissioner's Office](https://www.jeffcomm.org/past-results.html)
- Data geocoded in QGIS using the [MMQGIS](https://michaelminn.com/linux/mmqgis/) plugin and exported to GeoJSON files.
- Data visualized on GitHub Pages using [Bootstrap](https://getbootstrap.com/), [Leaflet](https://leafletjs.com/), and [Leaflet Control](https://opengeo.tech/maps/leaflet-search/) libraries. Adusted from [New Maps Plus](https://newmapsplus.github.io/map673/) course template. 
