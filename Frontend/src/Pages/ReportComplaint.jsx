// src/Pages/ReportComplaint.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import {
  Search,
  LocateFixed,
  Shield,
  ArrowLeft,
  ArrowRight,
  Check,
  List,
  Calendar,
  MapPin,
  FileText,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

// Leaflet Marker Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// ------------------ Hooks ------------------

const useGeoLocation = () => {
  const [coords, setCoords] = useState([23.81033, 90.412521]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords([pos.coords.latitude, pos.coords.longitude]),
      () => {}
    );
  }, []);

  return { coords, setCoords };
};

const fetchReverseGeocode = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const data = await res.json();
    return data.display_name || `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  } catch {
    return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  }
};

// ------------------ Map Helpers ------------------

function MapEvents({ setPosition, setAddress }) {
  useMapEvents({
    click: async ({ latlng }) => {
      const newPos = [latlng.lat, latlng.lng];
      setPosition(newPos);
      const address = await fetchReverseGeocode(latlng.lat, latlng.lng);
      setAddress(address);
    },
  });
  return null;
}

function MapFlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, 15, { animate: true, duration: 1.2 });
  }, [position, map]);

  return null;
}

// ------------------ Stepper ------------------

const Stepper = ({ currentStep }) => {
  const steps = useMemo(
    () => ["Incident Details", "Location & Time", "Review & Submit"],
    []
  );

  return (
    <div className="flex items-center w-full mb-10">
      {steps.map((label, idx) => {
        const active = currentStep === idx + 1;
        const done = currentStep > idx + 1;

        return (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  done || active
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {done ? <Check size={22} /> : idx + 1}
              </div>
              <span
                className={`mt-2 text-xs font-semibold ${
                  active || done ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {label}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 ${
                  done ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ------------------ Main Component ------------------

export default function ReportComplaint() {
  const { coords, setCoords } = useGeoLocation();
  const { api } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    incidentType: "",
    description: "",
    dateTime: "",
    location: "",
  });

  const shortenAddress = (fullAddress) => {
    if (!fullAddress) return "";
    const parts = fullAddress.split(",").map((p) => p.trim());
    return parts.slice(0, 2).join(", ");
  };

  const validateForm = () => {
    if (!formData.incidentType || !formData.description) {
      Swal.fire("Oops", "All fields are required.", "warning");
      return false;
    }

    if (!formData.dateTime) {
      Swal.fire("Hold up!", "Please select a date & time.", "warning");
      return false;
    }

    const picked = new Date(formData.dateTime);
    const now = new Date();

    if (picked > now) {
      Swal.fire("Nope", "Future dates aren't allowed.", "error");
      return false;
    }

    if (!formData.location) {
      Swal.fire(
        "Location Required",
        "Pick a location on the map or use search.",
        "warning"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      incidentType: formData.incidentType,
      description: formData.description,
      dateTime: formData.dateTime,
      location: {
        latitude: coords[0],
        longitude: coords[1],
        displayName: formData.location,
      },
      status: "pending",
    };

    Swal.fire({
      title: "Submitting...",
      html: "<b>Please wait</b>",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await api.post("/report/create", payload);

      Swal.close();

      Swal.fire({
        icon: "success",
        title: "Report Submitted",
        text: "Your incident has been successfully logged.",
        confirmButtonColor: "#16a34a",
      });

      // Reset form + go back to step 1
      setFormData({
        incidentType: "",
        description: "",
        dateTime: "",
        location: "",
      });

      setStep(1);
    } catch (error) {
      Swal.close();

      let message = "Couldn't submit report. Try again.";

      if (error.response?.data) {
        message = JSON.stringify(error.response.data, null, 2);
      }

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        html: `<pre class='text-left text-sm whitespace-pre-wrap'>${message}</pre>`,
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const goToCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        setCoords(newPos);

        const address = await fetchReverseGeocode(
          pos.coords.latitude,
          pos.coords.longitude
        );
        setFormData((f) => ({
          ...f,
          location: shortenAddress(address),
        }));
      },
      () => Swal.fire("Error", "Couldn't fetch location.", "error")
    );
  };

  const nextStep = () => setStep((s) => Math.min(3, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  // ---------------- Render ----------------

  return (
    <div className="w-full mt-20 min-h-screen p-4 md:p-8 bg-gray-50">
      {loading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 text-white text-lg font-bold">
          Submitting...
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row gap-8">
        {/* MAP */}
        <div className="w-full lg:w-3/5 h-[450px] lg:h-[80vh] rounded-2xl overflow-hidden shadow-xl">
          <MapContainer
            center={coords}
            zoom={13}
            scrollWheelZoom
            className="w-full h-full"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={coords} />
            <MapEvents
              setPosition={setCoords}
              setAddress={(addr) =>
                setFormData((f) => ({
                  ...f,
                  location: shortenAddress(addr),
                }))
              }
            />

            <MapFlyTo position={coords} />
          </MapContainer>
        </div>

        {/* FORM */}
        <div className="w-full lg:w-2/5 bg-white p-8 shadow-2xl rounded-2xl flex flex-col">
          <h1 className="text-3xl text-indigo-600 font-bold mb-2">
            Report an Incident
          </h1>
          <p className="text-gray-600 mb-8">Your report is anonymous.</p>

          <Stepper currentStep={step} />

          <div className="flex-1">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  className="space-y-6"
                >
                  <IconSelect
                    label="Incident Type"
                    name="incidentType"
                    value={formData.incidentType}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        incidentType: e.target.value,
                      }))
                    }
                    icon={<List size={18} />}
                  >
                    <option value="" disabled>
                      Select type...
                    </option>
                    <option value="verbal">Verbal Harassment</option>
                    <option value="physical_assault">Physical Assault</option>
                    <option value="discrimination">Discrimination</option>
                    <option value="stalking">Stalking</option>
                    <option value="unsafe_area">Unsafe Area</option>
                    <option value="other">Other</option>
                  </IconSelect>

                  <IconTextarea
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe what happened..."
                    icon={<FileText size={18} />}
                  />

                  <div className="flex justify-end border-t pt-6">
                    <button
                      onClick={nextStep}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                    >
                      Next <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  className="space-y-6"
                >
                  <IconInput
                    label="Date & Time"
                    name="dateTime"
                    type="datetime-local"
                    value={formData.dateTime}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        dateTime: e.target.value,
                      }))
                    }
                    icon={<Calendar size={18} />}
                  />

                  <div className="space-y-2">
                    <label className="block text-sm">Location</label>
                    <p className="text-xs text-gray-500">
                      Click map, search, or use current location.
                    </p>

                    <div className="flex space-x-2">
                      <button
                        onClick={goToCurrentLocation}
                        className="bg-green-600 text-white p-3 rounded-lg"
                      >
                        <LocateFixed size={18} />
                      </button>
                    </div>

                    <IconInput
                      name="location"
                      value={formData.location}
                      icon={<MapPin size={18} />}
                      readOnly
                      placeholder="Location will appear here"
                      isReadOnly
                    />
                  </div>

                  <div className="flex justify-between border-t pt-6">
                    <button
                      onClick={prevStep}
                      className="px-5 py-2.5 border border-gray-300 rounded-lg flex items-center gap-2"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                    >
                      Next <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="s3"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold">Review</h3>

                  <div className="flex items-center gap-3 bg-blue-50 text-blue-800 p-4 rounded-lg border">
                    <Shield size={24} />
                    <span>Your report is anonymous.</span>
                  </div>

                  <dl className="space-y-4 p-4 bg-gray-50 border rounded-lg">
                    <InfoRow label="Type" value={formData.incidentType} />
                    <InfoRow
                      label="Date/Time"
                      value={
                        formData.dateTime
                          ? new Date(formData.dateTime).toLocaleString()
                          : "N/A"
                      }
                    />
                    <InfoRow label="Location" value={formData.location} />

                    <div>
                      <dt className="font-medium text-gray-600">Description</dt>
                      <dd className="p-3 bg-white rounded">
                        {formData.description || "N/A"}
                      </dd>
                    </div>
                  </dl>

                  <div className="flex justify-between border-t pt-6">
                    <button
                      onClick={prevStep}
                      className="px-5 py-2.5 border border-gray-300 rounded-lg flex items-center gap-2"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-5 py-2.5 bg-green-600 text-white rounded-lg flex items-center gap-2"
                    >
                      <Shield size={16} /> Submit
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------ UI Components ------------------

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between">
    <dt className="font-medium text-gray-600">{label}</dt>
    <dd className="text-gray-900 max-w-xs text-right truncate">{value}</dd>
  </div>
);

const IconInput = ({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  icon,
  isReadOnly,
}) => (
  <div>
    {label && <label className="block mb-1 text-sm">{label}</label>}
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={isReadOnly}
        placeholder={placeholder}
        className={`w-full pl-10 pr-3 py-2 border rounded-lg ${
          isReadOnly ? "bg-gray-100" : ""
        }`}
      />
    </div>
  </div>
);

const IconSelect = ({ label, name, value, onChange, icon, children }) => (
  <div>
    <label className="block mb-1 text-sm">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2 border rounded-lg"
      >
        {children}
      </select>
    </div>
  </div>
);

const IconTextarea = ({ label, name, value, onChange, placeholder, icon }) => (
  <div>
    <label className="block mb-1 text-sm">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-3 text-gray-400">{icon}</span>
      <textarea
        rows="4"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2 border rounded-lg"
      />
    </div>
  </div>
);
