import { useRef, useState } from "react";
import { MetaFunction, useActionData, useLoaderData } from "@remix-run/react";
import sgMail from "@sendgrid/mail";
import ContactBanner from "../components/design/Info/ContactBanner";
import { getImageById } from "../components/.server/images/getImage";

// API
import { getBrands } from "../core/modules/brands/api";
import { getDevices } from "../core/modules/devices/api";
import { getParts } from "../core/modules/parts/api";
import { addContactForm } from "../core/modules/contactForm/api";

// Types
import { Brand } from "../core/modules/brands/type";
import { Devices } from "../core/modules/devices/type";
import { Parts } from "../core/modules/parts/type";
import { ActionFunctionArgs } from "@remix-run/node";

type LoaderData = {
  images: any;
  brands: Brand[];
  devices: Devices[];
  parts: Parts[];
};

export const meta: MetaFunction = () => {
  return [
    { title: "Herstellingen | Fixit Aalst" },
    {
      name: "description",
      content:
        "Fixit Aalst is gespecialiseerd in het herstellen van smartphones, tablets en laptops van merken zoals Apple, Samsung, Huawei, en OnePlus.",
    },
    {
      name: "keywords",
      content:
        "Fixit Aalst, smartphone herstelling, tablet reparatie, laptop herstel, Apple, Samsung, Huawei, OnePlus",
    },
    { name: "robots", content: "index, follow" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    {
      property: "og:title",
      content: "Fixit Aalst | Smartphone, Tablet & Laptop Herstellingen",
    },
    {
      property: "og:description",
      content:
        "Fixit Aalst biedt snelle en betrouwbare herstellingen voor smartphones, tablets en laptops.",
    },
  ];
};

export async function loader() {
  try {
    const images = await getImageById({ id: "3" });
    const brands = await getBrands();
    const devices = await getDevices(); // Now returns an array instead of { data: [...] }
    const parts = await getParts();

    if (!brands?.data || !devices.length || !parts.length) {
      throw new Error("No data available");
    }

    return {
      images,
      brands: brands.data,
      devices, // Already an array, no need for `devices.data`
      parts,
    };
  } catch (error) {
    console.error("Error while fetching data:", error);
    return { brands: [], devices: [], parts: [] };
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = new URLSearchParams(await request.text());
    const data = {
      firstname: formData.get("firstname") || "",
      lastname: formData.get("lastname") || "",
      email: formData.get("email") || "",
      phonenumber: formData.get("phonenumber") || "",
      message: formData.get("message") || "",
      subject: "Herstelling aanvraag",
    };
    const { firstname, lastname, email, phonenumber, message, subject } = data;

    // Validate the form fields
    if (!firstname || !lastname || !email || !message || !subject) {
      return { error: "Alle verplichte velden moeten ingevuld worden." };
    }

    // Save the contact form data (optional)
    const messageResponse = await addContactForm(
      firstname,
      lastname,
      email,
      phonenumber,
      message,
      subject
    );

    if (!messageResponse.data) {
      return {
        error: "Er is een fout opgetreden bij het verzenden van het bericht.",
      };
    }

    // Send the email via SendGrid
    const msg = {
      // FIXME: Change the email addresses
      to: `mixmaster578@gmail.com`, // Change to your recipient email
      from: "tristanderidder1@gmail.com", // Change to your verified sender email
      subject: `Nieuw bericht: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <p><strong>Van:</strong> ${firstname} ${lastname}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Telefoonnummer:</strong> ${phonenumber}</p>
          <p><strong>Bericht:</strong></p>
          <p style="background-color: #f9f9f9; padding: 10px; border: 1px solid #93C5FD;">${message}</p>
        </div>
      `,
    };

    // Send the email and check the response
    await sgMail.send(msg);

    return { success: "Het bericht is succesvol verzonden." };
  } catch (error) {
    console.error("Fout bij het verzenden van het bericht:", error);
    return {
      error: "Er is een fout opgetreden bij het verzenden van het bericht.",
    };
  }
};

export default function Repair() {
  const { images, brands, devices, parts } = useLoaderData<LoaderData>();
  const actionData: any = useActionData();
  const formRef = useRef<HTMLFormElement>(null);

  const [step, setStep] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Devices | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedPart, setSelectedPart] = useState<Parts | null>(null);
  const [confirmSelection, setConfirmSelection] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(actionData?.error || null);
  const [success, setSuccess] = useState<string | null>(
    actionData?.success || null
  );
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    message: "",
    subject: "",
  });

  // New state for search functionality
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getImageSrc = () => {
    if (selectedDevice?.image?.url) {
      return selectedDevice.image.url;
    }
    if (selectedBrand?.logo?.url) {
      return selectedBrand.logo.url;
    }
    return images?.url;
  };

  const deviceTypes = Array.from(new Set(devices.map((device) => device.type)));

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    const foundDevice = devices.find(
      (device) =>
        device.model.toLowerCase().includes(event.target.value.toLowerCase()) ||
        (device.modelType &&
          device.modelType
            .toLowerCase()
            .includes(event.target.value.toLowerCase()))
    );

    if (foundDevice) {
      setSelectedDevice(foundDevice);
      setSelectedBrand(foundDevice.brand);
      setSelectedType(foundDevice.type);
      setStep(3);
      setNotFound(false);
    } else {
      setSelectedDevice(null);
      setStep(1);
      setNotFound(true);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSuccess(null);

    // Validation
    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.email ||
      !formData.message
    ) {
      setError("Alle verplichte velden moeten ingevuld worden.");
      return;
    }

    // Reset error message before submitting
    setError(null);

    // Submit form
    e.target.submit();
  };

  return (
    <div className="px-4 sm:px-8 lg:px-32 py-4 flex flex-col justify-center items-center">
      {/* Search Bar */}
      <div className="w-full max-w-md p-4 mb-4">
        <input
          type="text"
          placeholder="Zoek naar een toestel"
          value={searchQuery}
          onChange={handleSearch}
          className="block w-full p-2 border rounded"
        />
        {notFound && (
          <p className="text-red-500 ">Geen toestel gevonden met deze naam.</p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-4xl mb-10">
        {/* Device Image Display */}
        <div className="flex justify-center items-center w-full lg:w-1/2">
          <img
            src={getImageSrc()}
            alt={
              selectedDevice
                ? selectedDevice.model
                : selectedBrand?.brandName || images
            }
            className="w-60 h-60 sm:w-72 sm:h-72 object-contain"
          />
        </div>

        {/* Step Content */}
        <div className="w-full h-96 lg:h-[40rem] lg:w-1/2 space-y-6">
          {step === 1 && (
            <div className="bg-primary p-4 rounded-md">
              <h2 className="text-xl font-bold">
                Selecteer een type van toestel
              </h2>
              <div className="overflow-y-scroll h-[30rem]">
                {deviceTypes.map((type) => (
                  <button
                    key={type}
                    className={`block w-full p-2 my-1 border rounded text-left ${
                      selectedType === type
                        ? "bg-accent"
                        : "bg-primaryHelper hover:bg-accent"
                    }`}
                    onClick={() => {
                      setSelectedType(type);
                      setConfirmSelection(true);
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {confirmSelection && (
                <button
                  className="mt-4 p-2 w-full border rounded-lg bg-accent"
                  onClick={() => {
                    setStep(2);
                    setConfirmSelection(false);
                  }}
                >
                  Bevestig
                </button>
              )}
            </div>
          )}

          {step === 2 && selectedType && (
            <div className="bg-primary p-4 rounded-md">
              <h2 className="text-xl font-bold">Selecteer een merk</h2>
              <div className="overflow-y-scroll h-[30rem]">
                {brands.map((brand) => (
                  <button
                    key={brand.documentId}
                    className={`block w-full p-2 my-1 border rounded text-left ${
                      selectedBrand?.documentId === brand.documentId
                        ? "bg-accent"
                        : "bg-primaryHelper hover:bg-accent"
                    }`}
                    onClick={() => {
                      setSelectedBrand(brand);
                      setConfirmSelection(true);
                    }}
                  >
                    {brand.brandName}
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <button
                  className="p-2 border rounded-lg bg-accentLight"
                  onClick={() => setStep(1)}
                >
                  Terug
                </button>
                {confirmSelection && (
                  <button
                    className="p-2 border rounded-lg bg-accent"
                    onClick={() => {
                      setStep(3);
                      setConfirmSelection(false);
                    }}
                  >
                    Bevestig
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 3 && selectedBrand && (
            <div className="bg-primary p-4 rounded-md">
              <h2 className="text-xl font-bold mb-4">Selecteer een model</h2>
              <div className="overflow-y-scroll h-[30rem]">
                {Array.from(
                  new Set(
                    devices
                      .filter(
                        (device) =>
                          device.brand?.brandName === selectedBrand.brandName &&
                          device.type === selectedType
                      )
                      .map((device) => device.model)
                  )
                ).map((model) => (
                  <details key={model} className="border rounded mb-2">
                    <summary className="p-2 bg-primaryHelper cursor-pointer">
                      {model}
                    </summary>
                    <div className="p-2">
                      {devices
                        .filter(
                          (device) =>
                            device.model === model &&
                            device.brand?.brandName ===
                              selectedBrand.brandName &&
                            device.type === selectedType
                        )
                        .map((variant) => (
                          <button
                            key={variant.documentId}
                            className={`block w-full p-2 my-1 border rounded text-left ${
                              selectedDevice?.documentId === variant.documentId
                                ? "bg-accent"
                                : "bg-accentLight hover:bg-accent"
                            }`}
                            onClick={() => setSelectedDevice(variant)}
                          >
                            {variant.model} {variant.modelType}
                          </button>
                        ))}
                    </div>
                  </details>
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <button
                  className="p-2 border rounded-lg bg-accentLight"
                  onClick={() => setStep(2)}
                >
                  Terug
                </button>
                {selectedDevice && (
                  <button
                    className="p-2 border rounded-lg bg-accent"
                    onClick={() => setStep(4)}
                  >
                    Bevestig
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 4 && selectedDevice && (
            <div className="bg-primary p-4 rounded-md">
              <h2 className="text-xl font-bold mb-4">
                Selecteer een onderdeel
              </h2>
              <div className="overflow-y-scroll h-[30rem]">
                {parts.filter(
                  (part) =>
                    part.device?.modelNumber === selectedDevice.modelNumber
                ).length > 0 ? (
                  parts
                    .filter(
                      (part) =>
                        part.device?.modelNumber === selectedDevice.modelNumber
                    )
                    .map((part) => (
                      <button
                        key={part.documentId}
                        className={`block w-full p-2 my-1 border rounded text-left ${
                          selectedPart?.documentId === part.documentId
                            ? "bg-accent"
                            : "bg-accentLight hover:bg-accent"
                        }`}
                        onClick={() => {
                          setSelectedPart(part);
                          setConfirmSelection(true);
                        }}
                      >
                        {part.name} - € {part.sellingPrice}
                      </button>
                    ))
                ) : (
                  <p>Geen onderdelen voor dit model</p>
                )}
              </div>
              <div className="flex justify-between mt-4">
                <button
                  className="p-2 border rounded-lg bg-accentLight"
                  onClick={() => setStep(3)}
                >
                  Terug
                </button>
                {confirmSelection && (
                  <button
                    className="p-2 border rounded-lg bg-accent"
                    onClick={() => {
                      setStep(5);
                      setConfirmSelection(false);
                    }}
                  >
                    Bevestig
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 5 && selectedDevice && (
            <div className="bg-primary p-4 rounded-md">
              <h2 className="text-xl font-bold mb-4">Contacteer ons</h2>
              <p className="mb-2">
                U heeft geselecteerd: <strong>{selectedDevice.model}</strong> en
                onderdeel: <strong>{selectedPart?.name}</strong>
              </p>
              <form
                method="POST"
                onSubmit={handleSubmit}
                ref={formRef}
                className="space-y-4"
              >
                <div>
                  <label className="block mb-1">Naam</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="firstname"
                      placeholder="Voornaam"
                      onChange={handleChange}
                      required
                      className="block w-full p-2 border rounded"
                    />
                    <input
                      type="text"
                      name="lastname"
                      placeholder="Achternaam"
                      onChange={handleChange}
                      required
                      className="block w-full p-2 border rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1">Telefoonnummer</label>
                  <input
                    type="tel"
                    name="phonenumber"
                    onChange={handleChange}
                    required
                    className="block w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    required
                    className="block w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">Bericht</label>
                  <textarea
                    name="message"
                    onChange={handleChange}
                    required
                    className="block w-full p-2 border rounded"
                  />
                </div>
                {error && (
                  <p className="p-4 border border-red-500 text-red-600 rounded-lg">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="p-4 border border-green-500 text-green-600 rounded-lg">
                    {success}
                  </p>
                )}
                <button
                  type="submit"
                  className="p-2 w-full border rounded-lg bg-accent"
                >
                  Verstuur
                </button>
              </form>
              <div className="flex justify-between mt-4">
                <button
                  className="p-2 border rounded-lg bg-accentLight"
                  onClick={() => setStep(4)}
                >
                  Terug
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ContactBanner />
    </div>
  );
}
