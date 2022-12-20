# Louisville Foreclosures

## Live URL
http://jacographer.com/louisville-foreclosures/

## Background
A property foreclosure is a legal producedure initiated by a lender to retake possession of a property on which there is a mortgage. Foreclosures are an important piece of urban geography for a variety of reasons. At the individual scale, foreclosures
can represent the loss of wealth invested in a home, which was particularly acute for African-American households who were targeted for preadytory loans in the years leading up to the 2008 financial crisis. 

As the same time, foreclosures have been an avenue of financial accumulation for institutional investors who became active in foreclosures auctions. These properties were bought at deeply discounted rates during the height of the foreclosure crisis and became the basis for institutional ownership of the single-family rental market. 

In recent years, there has been growing concern about the role of institutional investors in rental markets in a range of cities, particularly in the U.S. south. THis data provides a glimpse into that process, but could be furthered by incorporating additional years (2011-206) in which these investors were most active, as well as by adding an analytic component that tracks the conversion of property from individually owned to corporate ownership structures (i.e., Jane Smith --> Real Property Investmentss, LLC). 

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
