import { useLocation } from "@remix-run/react";

export default function ContactBanner() {
      const location = useLocation();
    

    return (
      <section className="bg-secondary text-white p-10 flex flex-col lg:flex-row justify-between items-center gap-8 mx-5 lg:mx-32 rounded-md">
        <h2 className="text-4xl md:text-6xl lg:text-7xl text-center lg:text-left w-full lg:w-4/12">
          Bel of kom even langs
        </h2>
        <p className="text-base md:text-lg text-center lg:text-left">
          Neem contact op via:{" "}
          <a href="tel:+32477220778" className="underline">
            0477 22 07 78
          </a>
        </p>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2513.8694201406884!2d4.065679999999999!3d50.9446279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c397d68ce66049%3A0xeb0fb7e062f0c0ef!2sFixit%20Aalst!5e0!3m2!1snl!2sbe!4v1740313641210!5m2!1snl!2sbe"
          className="w-full lg:w-[400px] h-[200px] rounded-lg"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    );
}