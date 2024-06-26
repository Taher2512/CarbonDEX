import React from "react";
import Subcard from "../../Components/Subcard";
import Navbar from "../../Components/Navbar.js";
import Image from "next/image";
import Button from "../../Components/Button.js";
import Footer from "../../Components/Footer.js";

function page() {
  const Plans = [
    {
      title: "Eco-Supporter",
      image:
        "https://images.unsplash.com/photo-1717869885094-4a6f55df8154?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "5",
      description: "Equivalent to planting 2 cedar trees every month.",
      offset: "125",
    },
    {
      title: "Eco-Supporter",
      image:
        "https://images.unsplash.com/photo-1717869885094-4a6f55df8154?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "5",
      description: "Equivalent to planting 2 cedar trees every month.",
      offset: "125",
    },
    {
      title: "Eco-Supporter",
      image:
        "https://images.unsplash.com/photo-1717869885094-4a6f55df8154?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "5",
      description: "Equivalent to planting 2 cedar trees every month.",
      offset: "125",
    },
    {
      title: "Eco-Supporter",
      image:
        "https://images.unsplash.com/photo-1717869885094-4a6f55df8154?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      price: "5",
      description: "Equivalent to planting 2 cedar trees every month.",
      offset: "125",
    },
  ];

  return (
    <main className="flex flex-col items-center overflow-hidden bg-gray-900 ">
      <Navbar />
      <div className="w-screen bg-green sm:py-24 py-8 text-black mb-16 flex flex-col items-center justify-center">
        <span className="sm:w-1/3 w-3/4 mb-16">
          <h1 className="sm:text-5xl text-2xl font-bold text-center mb-3">
            Choose a plan to offset your carbon footprint.
          </h1>
          <p className="text-center">
            Join us in supporting the global climate efforts.
          </p>
        </span>
        <span className="sm:w-1/3 w-3/4">
          <p className="text-center">
            Choose a subscription plan that suits you best. Your monthly support
            will fund a biodiverse forest that cleanses the atmosphere by
            sequestering CO2.
          </p>
          <p className="text-center font-semibold">
            Together, we will save the planet!
          </p>
        </span>
      </div>
      <div className=" grid sm:grid-cols-3 grid-cols-1 sm:w-3/4 sm:gap-y-20 gap-y-8 sm:gap-x-10 mb-24">
        {Plans.map((plans, index) => (
          <Subcard key={index} plans={plans} />
        ))}
      </div>
      <div className="w-full h-80">
        <Image
          className="object-cover"
          src="/treeimg.jpg"
          width={1920}
          height={1080}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div className="w-full mb-16 bg-green text-black py-8  flex flex-col items-center sm:px-96 px-16">
        <h5 className="text-center font-semibold text-xl mb-8">
          How do I know what's going on with my trees?
        </h5>
        <p className="text-center mb-16">
          We plant trees on our eco-project in Belize. When buying our packages,
          you’ll get a monthly update on the project’s progress. You can also
          read more about Belize project on our blog
        </p>
        <Button text="Read more" url="#" />
      </div>
      <div className="w-screen bg-green-300 text-black py-8 flex flex-col items-center ">
        <h5 className="text-center font-semibold ">Do you need a plan tailored for your business?</h5>
        <p className="text-center mb-16">Contact Us we will cater your needs.</p>
        <Button text="Contact Us" url="#" />
      </div>
      <Footer />
    </main>
  );
}

export default page;
