const supportedCountries = [
  {
    name: "World",
    currency: undefined,
    emoji: "🌐",
  },
  {
    name: "Australia",
    currency: "AUD",
    symbol: "AU$",
    emoji: "🇦🇺",
  },
  {
    name: "Canada",
    currency: "CAD",
    symbol: "CA$",
    emoji: "🇨🇦",
  },
  {
    name: "Ireland",
    currency: "EUR",
    symbol: "€",
    emoji: "🇮🇪",
  },
  {
    name: "New Zealand",
    currency: "NZD",
    symbol: "NZ$",
    emoji: "🇳🇿",
  },
  {
    name: "United Kingdom",
    currency: "GBP",
    symbol: "£",
    emoji: "🇬🇧",
  },
  {
    name: "United States",
    currency: "USD",
    symbol: "US$",
    emoji: "🇺🇸",
  },
];

module.exports = {
  getSupportedCountry: (countryName) => {
    console.log(countryName)
    return supportedCountries.find(({name}) => name === countryName) || supportedCountries[0]
  },
  supportedCountries
}