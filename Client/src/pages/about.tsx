
import BottomNav from '../components/Header'

function about() {
  return (
    <>

      <div className="max-w-3xl mx-auto p-6 lg:p-8 bg-white shadow-md rounded-lg mt-10">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">About Us</h1>
        <div className="space-y-6 text-gray-700">
          <p className="leading-relaxed">
            Welcome to Victory Online! We are a leading online platform dedicated to providing an exciting and responsible betting experience for sports enthusiasts and gaming aficionados alike.
          </p>
          <p className="leading-relaxed">
            Founded in 2024, our mission is to offer a safe, fair, and enjoyable environment for our users to engage in sports betting and online gaming. We are committed to promoting responsible gambling and ensuring the highest standards of security and fairness in all our operations.
          </p>
          <p className="leading-relaxed">
            Our team consists of industry experts with years of experience in online betting, technology, and customer service. We leverage cutting-edge technology to provide a seamless and user-friendly betting experience across all devices.
          </p>
          <p className="leading-relaxed">
            We offer a wide range of betting options on various sports, including football, basketball, tennis, and many more. Our platform also features live betting, allowing you to place bets in real-time as the action unfolds.
          </p>
          <p className="leading-relaxed">
            At our core, we believe in transparency, integrity, and customer satisfaction. We are licensed and regulated by relevant authorities to ensure compliance with all applicable laws and regulations in the jurisdictions we operate in.
          </p>
          <p className="leading-relaxed">
            Thank you for choosing Victory Online. We look forward to providing you with an unparalleled betting experience!
          </p>
        </div>
      </div>

    <BottomNav />
    </>
  )

}

export default about