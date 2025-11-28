// Mini city -> region dataset for Shipping_Route
// Structure: { CountryName: { cities: [cityNames], regions: { cityName: [regionNames] } } }

const CITY_REGIONS = {
  Poland: {
    cities: ["Kraków", "Warsaw", "Gdańsk", "Wrocław", "Poznań"],
    regions: {
      Kraków: ["Nowa Huta", "Stare Miasto"],
      Warsaw: ["Śródmieście", "Mokotów"],
      Gdańsk: ["Przymorze", "Wrzeszcz"],
      Wrocław: ["Krzyki", "Stare Miasto"],
      Poznań: ["Stare Miasto", "Winogrady"],
    },
  },
  "United States": {
    cities: ["New York", "Los Angeles", "Chicago", "San Francisco", "Miami"],
    regions: {
      "New York": ["Manhattan", "Brooklyn"],
      "Los Angeles": ["Hollywood", "Downtown"],
      Chicago: ["Loop", "North Side"],
      "San Francisco": ["Mission", "SoMa"],
      Miami: ["Miami Beach", "Downtown"],
    },
  },
  Germany: {
    cities: ["Berlin", "Munich", "Hamburg"],
    regions: {
      Berlin: ["Mitte", "Kreuzberg"],
      Munich: ["Bavaria"],
      Hamburg: ["Hamburg"],
    },
  },
  "United Kingdom": {
    cities: ["London", "Manchester"],
    regions: {
      London: ["Greater London"],
      Manchester: ["Greater Manchester"],
    },
  },
  France: {
    cities: ["Paris"],
    regions: {
      Paris: ["Île-de-France"],
    },
  },
};

export default CITY_REGIONS;
