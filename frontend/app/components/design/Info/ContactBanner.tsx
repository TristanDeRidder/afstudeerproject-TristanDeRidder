import { useLocation } from "@remix-run/react";

export default function ContactBanner() {
      const location = useLocation();
    

    return (
      <div
        className={
          location.pathname !== "/repair"
            ? "bg-secondary text-white p-10 flex justify-between items-center gap-12 mx-5 lg:mx-32 rounded-md"
            : "bg-secondary text-white p-10 flex justify-between items-center gap-12 rounded-md"
        }
      >
        <p className="text-7xl w-4/12">Bel of kom even langs</p>
        <p className="text-lg">
          Neem contact op via: <a href="tel:+32477220778">0477 22 07 78</a>
        </p>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2513.8694201406884!2d4.065679999999999!3d50.9446279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c397d68ce66049%3A0xeb0fb7e062f0c0ef!2sFixit%20Aalst!5e0!3m2!1snl!2sbe!4v1740313641210!5m2!1snl!2sbe"
          width="400"
          height="200"
          style={{ borderRadius: "10px" }}
          allowFullScreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    );
}