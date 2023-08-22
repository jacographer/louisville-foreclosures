# Foreclosure Sales in Louisville, KY (2016-2022)

## Live URL
http://jacographer.com/louisville-foreclosures/

Published Nov. 2022, revised August 2023.

## Purpose
Our goal is for users to be able to visualize patterns of foreclosure by area, and to search through the data by address. This map is designed for researchers with interests in contemporary urban housing markets and trends. The goal is to help researchers scope out patterns in the data and facilitate further research into the topic (a) within the city of Louisville and (b) across and between U.S. cities.

## Process
We downloaded, cleaned, and georeferenced foreclosure sales retrieved from the [Jefferson Circuit Court Commissioner's Office](https://jeffcomm.org/past-results.html). These data included the address, sale date, plaintiff, purchaser, and purchase amount. Sales which were "Withdrawn" were removed from the dataset.

Data cleaning also involved reformatting addresses and correcting typos. As part of this process we removed any aparment number or unit information. Following geocoding, we also reformatted purchaser and plaintiff names. This involved standardizing certain phrases (e.g "Purchaser, Inc" becomes "Purchaser Inc."), as well as differently-recorded names which could be associated with one another (e.g. "Jonathan Quincy Public," "John (NMN) Public," and "Jonathan Public" all become "John Q. Public").

Importantly, not all sales were able to be successfully georeferenced. As a result, the data is not comprehensive, yet still representative of spatial trends and major purchasers.

## Tech Stack
The data was processed in RStudio, using the [`tidygeocoder`](https://cran.r-project.org/web/packages/tidygeocoder/readme/README.html) package to georeference via OpenStreetMap's [Nominatim](https://nominatim.org/) service. The data was exported as GeoJSON data in order to be be stored and loaded into the map. We used Leaflet to load in and visualize the data. The map interface itself was built in HTML with Bootstrap and styled using CSS.

## Sources
- Data downloaded as Excel spreadsheet from [Jefferson County Circuit Court Commissioner's Office](https://www.jeffcomm.org/past-results.html)
- Data geocoded using the [`tidygeocoder`](https://cran.r-project.org/web/packages/tidygeocoder/readme/README.html) package and [Nominatim](https://nominatim.org/) service and exported to GeoJSON files.
- Data visualized on GitHub Pages using [Bootstrap](https://getbootstrap.com/) and [Leaflet](https://leafletjs.com/) libraries.
- HTML developed from templates provided by the [New Maps Plus](https://newmapsplus.github.io/map673/) courses.
