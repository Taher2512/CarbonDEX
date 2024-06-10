import React from "react";

function Subcard({plans}) {
  return (
    <div className="max-w-sm  text-black border border-gray-200 rounded-lg shadow bg-green dark:border-gray-700">
      <a href="#">
        <img
          className="rounded-t-lg"
          src={plans.image}
          alt=""
        />
      </a>
      <div className="py-5 px-8 flex flex-col items-center">
        <h5 className="mb-2 text-2xl font-bold tracking-tight ">
          {plans.title}
        </h5>
        <h6 className= "mb-2 font-semibold">
            ${plans.price}/month
        </h6>

        <p className="mb-16 font-medium text-black text-center ">
          {plans.description}
        </p>
        <p className="mb-0 font-semibold text-black">
          Offset {plans.offset} kg of CO2
        </p>
        <p className="mb-8 font-normal text-black text-center">
          over the planting schedule of the project.
        </p>
        <a
          href="#"
          className="inline-flex items-center px-4 py-3 text-md font-medium text-center text-white bg-black rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300 "
        >
          Choose this plan
          <svg
            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default Subcard;
