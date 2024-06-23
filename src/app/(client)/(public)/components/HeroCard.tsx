import Featured from './Featured';

export const HeroCard = () => {
  return (
    <div className="p-3 md:p-0">
      <Featured
        image="/default/why-stamp.png"
        title="Why choose StampEzee?"
        description=" Digitalization has transformed the way businesses interact with their customers. Our platform combines intuitive design, robust
    analytics, and unparalleled customization, bringing you the ultimate tool for customer engagement."
        bgHeight="py-20"
      />
      <Featured
        imagePosition="right"
        image="/default/empower.png"
        title="Empower Customer Retention"
        description="In today's competitive market, customer retention is key. StampEzee fosters loyalty and encourages repeat business. More than a rewards system, our platform amplifies your brand engagement, nurturing long-lasting customer relationships."
        bgHeight="py-20"
      />
    </div>
  );
};
