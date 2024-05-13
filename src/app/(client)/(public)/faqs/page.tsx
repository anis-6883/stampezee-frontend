import Accordion from '../components/Accordion';

export default function page() {
  const faqData = [
    {
      _id: '1',
      title: 'What services does Stamp-Ezee provide?',
      body: 'Stamp-Ezee provides a range of services including stamp making, engraving, and custom printing solutions. Whether you need a personalized rubber stamp, an engraved plaque, or custom printed materials, Stamp-Ezee has you covered.',
    },
    {
      _id: '2',
      title: 'How can I order a custom stamp from Stamp-Ezee?',
      body: 'Ordering a custom stamp from Stamp-Ezee is easy! Simply visit our website, choose the type and size of stamp you need, upload your design or specify your requirements, and proceed to checkout. Our team will take care of the rest and deliver your custom stamp to your doorstep.',
    },
    {
      _id: '3',
      title: 'Does Stamp-Ezee offer international shipping?',
      body: 'Yes, Stamp-Ezee offers international shipping to customers worldwide. No matter where you are located, you can order from Stamp-Ezee and have your products delivered to your address.',
    },
    {
      _id: '4',
      title: 'Can I track my order status?',
      body: 'Yes, you can track your order status easily on the Stamp-Ezee website. Once your order is processed and shipped, you will receive a tracking number which you can use to monitor the delivery status of your package.',
    },
    {
      _id: '5',
      title: 'How long does it take to receive my order?',
      body: 'The delivery time depends on your location and the shipping method chosen. Typically, orders within the same country are delivered within a few business days, while international orders may take longer. You can check the estimated delivery time during checkout.',
    },
    {
      _id: '6',
      title: 'What payment methods does Stamp-Ezee accept?',
      body: 'Stamp-Ezee accepts various payment methods including credit cards, debit cards, PayPal, and bank transfers. You can choose the payment method that is most convenient for you during checkout.',
    },
    {
      _id: '7',
      title: 'Can I return or exchange my order?',
      body: 'Stamp-Ezee has a hassle-free return and exchange policy. If you are not satisfied with your order for any reason, you can return it within a specified period for a refund or exchange. Please refer to our returns policy for more information.',
    },
    {
      _id: '8',
      title: 'Does Stamp-Ezee offer bulk discounts?',
      body: 'Yes, Stamp-Ezee offers bulk discounts on large orders. If you need to place a bulk order for stamps, plaques, or printed materials, please contact our sales team for a custom quote and special pricing.',
    },
    {
      _id: '9',
      title: 'Are Stamp-Ezee products customizable?',
      body: 'Absolutely! Stamp-Ezee specializes in providing customizable products to meet your specific needs. Whether you need a stamp with your company logo, an engraved plaque with personalized text, or custom printed materials, we can tailor our products to your requirements.',
    },
    {
      _id: '10',
      title: 'How can I contact Stamp-Ezee customer support?',
      body: 'If you have any questions or need assistance, you can contact Stamp-Ezee customer support via phone, email, or live chat. Our friendly and knowledgeable team is here to help you with any queries or concerns you may have.',
    },
  ];

  return (
    <div>
      <div className="relative mx-auto w-full">
        <img src="default/faq-hero.jpg" alt="hero image" className="h-[36vh] w-full object-cover sm:h-[63vh]" />
        <div className="faq-hero absolute inset-0"></div>
        <div className="absolute inset-0  mx-auto  max-w-screen-xl items-center">
          <div className="flex h-full items-center justify-center sm:ml-3 sm:block">
            <div className="bottom-[28%] sm:absolute">
              <div className="text-center text-4xl font-bold text-[#DF2828] sm:text-left sm:text-6xl">
                <span style={{ opacity: 1, transform: 'none' }}>H</span>
                <span style={{ opacity: 1, transform: 'none' }}>o</span>
                <span style={{ opacity: 1, transform: 'none' }}>w</span>
              </div>
              <br />
              <div className="flex gap-3 text-[1.5rem]  font-bold text-white sm:text-6xl md:text-[4rem]">
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>c</span>
                  <span style={{ opacity: 1, transform: 'none' }}>a</span>
                  <span style={{ opacity: 1, transform: 'none' }}>n</span>
                </div>
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>w</span>
                  <span style={{ opacity: 1, transform: 'none' }}>e</span>
                </div>
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>h</span>
                  <span style={{ opacity: 1, transform: 'none' }}>e</span>
                  <span style={{ opacity: 1, transform: 'none' }}>l</span>
                  <span style={{ opacity: 1, transform: 'none' }}>p</span>
                </div>
                <div className="">
                  <span style={{ opacity: 1, transform: 'none' }}>y</span>
                  <span style={{ opacity: 1, transform: 'none' }}>o</span>
                  <span style={{ opacity: 1, transform: 'none' }}>u</span>
                  <span style={{ opacity: 1, transform: 'none' }}>?</span>
                </div>
              </div>
              <div className="MuiStack-root css-plpzdo" />
            </div>
          </div>
        </div>
      </div>
      <div className="md-px-0 container mx-auto mt-10 max-w-screen-xl px-3">
        <h1 className="text-[2rem] font-bold  leading-tight">Frequently asked questions</h1>
      </div>

      <div className="md-px-0 container mx-auto mt-10 max-w-screen-xl px-3">
        <Accordion faqData={faqData} />
      </div>
    </div>
  );
}
