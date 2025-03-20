import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const cities = [
  { label: "Abbottabad", value: "abbottabad" },
  { label: "Ahmadpur East", value: "ahmadpureast" },
  { label: "Bahawalnagar", value: "bahawalnagar" },
  { label: "Bahawalpur", value: "bahawalpur" },
  { label: "Burewala", value: "burewala" },
  { label: "Chakwal", value: "chakwal" },
  { label: "Charsadda", value: "charsadda" },
  { label: "Chichawatni", value: "chichawatni" },
  { label: "Chiniot", value: "chiniot" },
  { label: "Chishtian", value: "chishtian" },
  { label: "Dadu", value: "dadu" },
  { label: "Daska", value: "daska" },
  { label: "Dera Ghazi Khan", value: "deraghazikhan" },
  { label: "Dera Ismail Khan", value: "deraismailkhan" },
  { label: "Farooka", value: "farooka" },
  { label: "Faisalabad", value: "faisalabad" },
  { label: "Gojra", value: "gojra" },
  { label: "Gujranwala", value: "gujranwala" },
  { label: "Gujrat", value: "gujrat" },
  { label: "Hafizabad", value: "hafizabad" },
  { label: "Hyderabad", value: "hyderabad" },
  { label: "Islamabad", value: "islamabad" },
  { label: "Jacobabad", value: "jacobabad" },
  { label: "Jaranwala", value: "jaranwala" },
  { label: "Jhelum", value: "jhelum" },
  { label: "Kamalia", value: "kamalia" },
  { label: "Karachi", value: "karachi" },
  { label: "Kasur", value: "kasur" },
  { label: "Kandhkot", value: "kandhkot" },
  { label: "Khairpur", value: "khairpur" },
  { label: "Khushab", value: "khushab" },
  { label: "Khuzdar", value: "khuzdar" },
  { label: "Khanewal", value: "khanewal" },
  { label: "Khanpur", value: "khanpur" },
  { label: "Kohat", value: "kohat" },
  { label: "Kot Adu", value: "kotadu" },
  { label: "Lahore", value: "lahore" },
  { label: "Larkana", value: "larkana" },
  { label: "Mandi Bahauddin", value: "mandibahauddin" },
  { label: "Mansehra", value: "mansehra" },
  { label: "Mardan", value: "mardan" },
  { label: "Mianwali", value: "mianwali" },
  { label: "Mingora", value: "mingora" },
  { label: "Mirpur Khas", value: "mirpurkhas" },
  { label: "Multan", value: "multan" },
  { label: "Muzaffargarh", value: "muzaffargarh" },
  { label: "Muridke", value: "muridke" },
  { label: "Nawabshah", value: "nawabshah" },
  { label: "Nowshera", value: "nowshera" },
  { label: "Okara", value: "okara" },
  { label: "Pakpattan", value: "pakpattan" },
  { label: "Peshawar", value: "peshawar" },
  { label: "Quetta", value: "quetta" },
  { label: "Rahim Yar Khan", value: "rahimyarkhan" },
  { label: "Rawalpindi", value: "rawalpindi" },
  { label: "Sadiqabad", value: "sadiqabad" },
  { label: "Sahiwal", value: "sahiwal" },
  { label: "Sargodha", value: "sargodha" },
  { label: "Sheikhupura", value: "sheikhupura" },
  { label: "Shikarpur", value: "shikarpur" },
  { label: "Sukkur", value: "sukkur" },
  { label: "Swabi", value: "swabi" },
  { label: "Tando Adam", value: "tandoadam" },
  { label: "Tando Allahyar", value: "tandoallahyar" },
  { label: "Vehari", value: "vehari" },
  { label: "Wah Cantonment", value: "wahcantonment" },
  { label: "Wazirabad", value: "wazirabad" },
];

export interface User {
  city: string;
  companyName: string;
  email: string;
  firstName: string;
  lastName: string;
  session_id: string;
}

/**
 * Utility function to properly format API responses
 * @param response The response from the API
 * @returns Formatted string representation of the response
 */
export function formatApiResponse(response: any): string {
  if (!response) return "No response received";

  try {
    // If it's already a string, return it
    if (typeof response === "string") return response;

    // Handle the specific API response structure
    if (typeof response === "object") {
      // Check if it's the API response structure with data.llm_response
      if (response.data && response.data.llm_response) {
        return response.data.llm_response;
      }

      // Check if it's just the data object with llm_response
      if (response.llm_response) {
        return response.llm_response;
      }

      // Check for other common response patterns
      if (response.response) return response.response;
      if (response.text) return response.text;
      if (response.content) return response.content;
      if (response.message && response.message !== "") return response.message;

      // If none of the above, stringify the object
      return JSON.stringify(response, null, 2);
    }

    // Default fallback
    return String(response);
  } catch (error) {
    console.error("Error formatting response:", error);
    return "Error formatting response";
  }
}
