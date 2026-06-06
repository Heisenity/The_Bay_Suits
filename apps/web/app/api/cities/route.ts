import { NextRequest, NextResponse } from "next/server";
import { City, State } from "country-state-city";

type CityOption = {
  city: string;
  state: string;
  country: string;
  countryCode: "IN" | "CA" | "US" | "BD";
  label: string;
};

const countries = [
  { code: "IN" as const, name: "India" },
  { code: "CA" as const, name: "Canada" },
  { code: "US" as const, name: "United States" },
  { code: "BD" as const, name: "Bangladesh" }
];

const featured = [
  "Toronto, Ontario, Canada",
  "Vancouver, British Columbia, Canada",
  "Montreal, Quebec, Canada",
  "Calgary, Alberta, Canada",
  "Ottawa, Ontario, Canada",
  "New York City, New York, United States",
  "Miami, Florida, United States",
  "Los Angeles, California, United States",
  "Kolkata, West Bengal, India",
  "Delhi, Delhi, India",
  "Bengaluru, Karnataka, India",
  "Mumbai, Maharashtra, India",
  "Dhaka, Dhaka District, Bangladesh",
  "Chittagong, Chittagong Division, Bangladesh"
];

let cityIndex: CityOption[] | undefined;

function getCityIndex() {
  if (cityIndex) return cityIndex;

  cityIndex = countries.flatMap(({ code, name: country }) =>
    (City.getCitiesOfCountry(code) || []).map((city) => {
      const state = State.getStateByCodeAndCountry(city.stateCode, code)?.name || city.stateCode;
      return {
        city: city.name,
        state,
        country,
        countryCode: code,
        label: `${city.name}, ${state}, ${country}`
      };
    })
  );

  return cityIndex;
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim().toLocaleLowerCase() || "";
  const countryCode = request.nextUrl.searchParams.get("country");
  const allCities = getCityIndex();

  if (!query) {
    return NextResponse.json(
      featured
        .map((label) => allCities.find((city) => city.label === label))
        .filter(Boolean)
    );
  }

  const eligible = countryCode
    ? allCities.filter((city) => city.countryCode === countryCode)
    : allCities;

  const ranked = eligible
    .map((city) => {
      const cityName = city.city.toLocaleLowerCase();
      const label = city.label.toLocaleLowerCase();
      let score = 4;
      if (cityName === query) score = 0;
      else if (cityName.startsWith(query)) score = 1;
      else if (label.startsWith(query)) score = 2;
      else if (label.includes(query)) score = 3;
      return { city, score };
    })
    .filter(({ score }) => score < 4)
    .sort((a, b) => a.score - b.score || a.city.city.localeCompare(b.city.city))
    .slice(0, 60)
    .map(({ city }) => city);

  return NextResponse.json(ranked, {
    headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" }
  });
}
