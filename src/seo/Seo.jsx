import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

import { SeoConfig } from "./seoConfig";

const baseUrl = "https://www.wagnistrip.com";
const Seo = () => {
  const location = useLocation();
  const { pathname } = location;

  let meta = SeoConfig[pathname];
  const flightRegex = /^\/flights\/([a-zA-Z-]+)-([a-zA-Z]+)-to-([a-zA-Z-]+)-([a-zA-Z]+)\/?$/;

  const match = pathname.match(flightRegex);
  if (match) {
    const [, originName, originCode, destinationName, destinationCode] = match;

    const origin = originName.replace(/-/g, " ");
    const destination = destinationName.replace(/-/g, " ");
    meta = {
      title: `Book Flights from ${capitalize(origin)} (${originCode.toUpperCase()}) to ${capitalize(destination)} (${destinationCode.toUpperCase()}) Flight Tickets`,
      description: `Book cheap ${capitalize(origin)} to ${capitalize(destination)} flights on Wagnistrip. Compare fares, enjoy exclusive offers, and book your ${capitalize(originCode)} to ${capitalize(destinationCode)} tickets at the best price.`,
      metakeyword: `${origin} to ${destination} flights, cheap ${origin} to ${destination} flight tickets, book ${origin} ${destination} flights, ${originCode} to ${destinationCode} flights, Wagnistrip flight booking`,
      canonical: `${baseUrl}${pathname}`,
    };
  }

  if (!meta) {
    meta = {
      title: "Book Flights at Lowest Price | Cheap Tickets & Last-Minute Deals",
      description: "Book cheap domestic & international flights with Wagnistrip.",
      metakeyword: "low price flight ticket, cheap international flights, cheap domestic flights, last minute flight deals",
      canonical: `${baseUrl}${pathname}`,
    };
  }

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.metakeyword} />
      <link rel="canonical" href={meta.canonical} />
    </Helmet>
  );
};

const capitalize = (str) =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

export default Seo;
