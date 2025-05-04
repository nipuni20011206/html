import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import L to fix potential marker icon issues

// Fix Leaflet's default icon path issue with bundlers like Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


// Small component for displaying detail items consistently
const DetailItem = ({ label, value }) => (
  <div>
    <span className="block text-sm font-medium text-gray-500">{label}</span>
    <span className="block text-lg text-gray-800 font-semibold">{value || 'N/A'}</span>
  </div>
);

const CountryDetails = () => {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error on new fetch
        const res = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`);
        if (res.data && res.data.length > 0) {
          setCountry(res.data[0]);
        } else {
          setError("Country details not found.");
        }
      } catch (err) {
        console.error("API Error:", err); // Log the actual error
        setError(`Failed to fetch country details. ${err.response?.status === 404 ? 'Country code not found.' : 'Please try again later.'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryDetails();
  }, [code]);

  // Improved Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-500">Loading Country Data...</div>
        {/* Optional: Add a spinner here */}
      </div>
    );
  }

  // Improved Error State
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md text-center" role="alert">
          <strong className="font-bold block mb-2">Error!</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  // Render Country Details
  if (!country) return null; // Should not happen if error handling is correct, but good practice

  const formatValue = (value) => value || 'N/A';
  const formatList = (obj) => obj ? Object.values(obj).join(", ") : 'N/A';
  const formatCurrencies = (currencies) => {
      if (!currencies) return 'N/A';
      return Object.values(currencies).map(curr => `${curr.name} (${curr.symbol})`).join(", ");
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-blue-50 min-h-screen p-4 md:p-8">
      {/* Centered Container */}
      <div className="max-w-7xl mx-auto">
        {/* Country Name Header */}
        <h1 className="text-4xl md:text-5xl font-bold mb-8 md:mb-12 text-gray-800 text-center drop-shadow-sm">
          {country.name.common} {country.flag} {/* Include emoji flag if available */}
        </h1>

        {/* Main Content Grid - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Details Card (Takes 1 column on large screens) */}
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-200 order-2 lg:order-1">
             {/* Flag */}
             <img
              src={country.flags.svg}
              alt={`Flag of ${country.name.common}`}
              className="w-full h-40 object-contain mb-6 rounded border border-gray-200 bg-gray-50" // Contained flag with border
             />

            <div className="space-y-4"> {/* Consistent spacing for details */}
              <DetailItem label="Official Name" value={formatValue(country.name.official)} />
              <DetailItem label="Capital" value={formatValue(country.capital?.[0])} />
              <DetailItem label="Region / Subregion" value={`${formatValue(country.region)} / ${formatValue(country.subregion)}`} />
              <DetailItem label="Population" value={formatValue(country.population?.toLocaleString())} />
              <DetailItem label="Area" value={country.area ? `${country.area.toLocaleString()} km²` : 'N/A'} />
              <DetailItem label="Languages" value={formatList(country.languages)} />
              <DetailItem label="Currencies" value={formatCurrencies(country.currencies)} />
              <DetailItem label="Calling Code(s)" value={country.idd?.root + (country.idd?.suffixes?.join(', ') || '')} />
              <DetailItem label="Timezones" value={formatValue(country.timezones?.join(', '))} />
            </div>
          </div>

          {/* Map Section (Takes 2 columns on large screens) */}
          <div className="lg:col-span-2 h-80 md:h-96 lg:h-[550px] rounded-xl shadow-lg overflow-hidden border border-gray-200 order-1 lg:order-2">
            {country.latlng ? (
              <MapContainer
                center={[country.latlng[0], country.latlng[1]]}
                zoom={5} // Slightly zoomed out for better context
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false} // Disable scroll wheel zoom by default if preferred
              >
                <TileLayer
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[country.latlng[0], country.latlng[1]]}>
                  <Popup>{country.name.common}</Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="flex justify-center items-center h-full bg-gray-200 text-gray-500">
                Map data not available.
              </div>
            )}
          </div>

        </div>
         {/* Optional: Add a section for Border Countries or other related info */}
         {country.borders && country.borders.length > 0 && (
            <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">Border Countries</h2>
              <div className="flex flex-wrap gap-2">
                {country.borders.map(borderCode => (
                  <a // Use Link from react-router-dom if you want internal navigation
                    key={borderCode}
                    href={`/country/${borderCode}`} // Adjust URL structure if needed
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    {borderCode} {/* Ideally, fetch border country names too */}
                  </a>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default CountryDetails;