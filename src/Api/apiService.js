import axios from "axios";
import CryptoJS from "crypto-js";
axios.defaults.withCredentials = true;
import data from '../utils/data.json';
const SECRET_KEY = "k7sP1Dg4WmRpTcA1ZfLuQxBvNmCa8eGs";
const IV = CryptoJS.enc.Utf8.parse("uA6vW1k2PsRsYz3S");
const apiClient = axios.create({
  baseURL: "https://admin.wagnistrip.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// http://192.168.0.186:8000/api
// https://admin.wagnistrip.com/api


export const fetchAirlineCodes = (searchQuery = "") => {
  try {
    const query = searchQuery.trim().toLowerCase();

    // Use the appropriate dataset based on type
    // const dataset = type === "specailFlight" ? specialdata : data;

    // If no search query, return the top 10 results sorted by IATA
    if (!query) {
      return data
        .slice(0, 10) // slice before sort for performance
        .sort((a, b) => a.iata.localeCompare(b.iata));
    }

    const exactMatches = [];
    const suggestions = [];

    for (const item of data) {
      const iata = item.iata?.toLowerCase() ?? "";
      const cityCode = item.CityCode?.toLowerCase() ?? "";
      const countryCode = item.CountryCode?.toLowerCase() ?? "";
      const city = item.city?.toLowerCase() ?? "";
      const state = item.state?.toLowerCase() ?? "";
      const country = item.country?.toLowerCase() ?? "";
      const airport = item.airport?.toLowerCase() ?? "";

      if (query === iata) {
        exactMatches.push(item);
      } else if (
        iata.startsWith(query) ||
        cityCode.includes(query) ||
        countryCode.includes(query) ||
        city.includes(query) ||
        state.includes(query) ||
        country.includes(query) ||
        airport.includes(query)
      ) {
        suggestions.push(item);
      }
    }

    const sortByIATA = (a, b) => a.iata.localeCompare(b.iata);


    return [...exactMatches.sort(sortByIATA), ...suggestions.sort(sortByIATA)]
      .slice(0, 50);
  } catch (error) {
    console.error("Error fetching airline codes:", error);
    return [];
  }
};

export const fetchOffersData = async (url) => {
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching coupons codes:", error);
    throw error;
  }
};

export const customerProfile = async (url, token) => {
  try {
    const response = await apiClient.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching customer profile:", error);
    throw error;
  }
};

export const customerProfileUpdate = async (url, data, token) => {
  try {
    const response = await apiClient.put(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating customer profile:", error);
    throw error;
  }
};

export const porfileImgeupload = async (endpoint, requestData, token) => {
  try {
    const response = await apiClient.post(endpoint, requestData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error occurred while making an external API request:",
      error
    );
    throw error;
  }
};

export const galileoApi = async (endpoint, requestData, token) => {
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  try {
    const response = await apiClient.post(endpoint, requestData, { headers });
    return response.data;
  } catch (error) {
    console.error("Error Add passangerdetails flight with Galileo:", error);
    throw error;
  }
};

export const encryptPayload = (data) => {
  const json = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(
    json,
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  return encrypted.toString();
};

export const decryptPayload = (encryptedText) => {
  const decrypted = CryptoJS.AES.decrypt(
    encryptedText,
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
  return JSON.parse(plaintext);
};


