import PrimaryTitle from "../components/design/Title/PrimaryTitle";
import OpeningHours from "../components/design/Info/OpeningHours";
import ContactForm from "../components/design/Form/ContactForm";

export default function Contact() {
    return (
      <>
        <PrimaryTitle title="Contact" />
        <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5027.738840281377!2d4.065679999999999!3d50.9446279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c397d68ce66049%3A0xeb0fb7e062f0c0ef!2sFixit%20Aalst!5e0!3m2!1snl!2sbe!4v1739367117436!5m2!1snl!2sbe"
            width="600"
            height="450"
            loading="lazy"
          ></iframe>
          <OpeningHours />
          <ContactForm />
        </div>
      </>
    );
}