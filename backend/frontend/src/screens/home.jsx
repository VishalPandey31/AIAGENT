import React, { useContext } from "react";
import { UserContext } from "../context/user.context";

const Home = () => {
  const { user } = useContext(UserContext);

  return (
    <main className='p-4'>
      <div className='projects'>
        <button className="project">
          <i className="ri-link"></i>
        </button>
      </div>

    </main>
  );
};
export default Home;
