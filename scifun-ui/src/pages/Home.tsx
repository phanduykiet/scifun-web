import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Lessons from "../components/layout/Lessons";
import Footer from "../components/layout/Footer";

const Home: React.FC = () => {
  const images = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGrlIO4ES80Wt3ELJyTkUuqosDLSbLsHEjPBYHEgRJlRqSfvKLxRIe4E_95pkSAxligK0&usqp=CAU",
    "https://www.shutterstock.com/image-vector/chemistry-items-seamless-pattern-cartoon-260nw-2267777097.jpg",
    "https://media.istockphoto.com/id/2148124381/vi/anh/c%E1%BA%A5u-tr%C3%BAc-xo%E1%BA%AFn-dna-l%E1%BA%A5p-l%C3%A1nh-m%C3%A0u-xanh-v%C3%A0-%C4%91%E1%BB%8F-kh%C3%A1i-ni%E1%BB%87m-c%C3%B4ng-ngh%E1%BB%87-cao-v%E1%BB%81-nghi%C3%AAn-c%E1%BB%A9u-di-truy%E1%BB%81n-tin.jpg?s=612x612&w=0&k=20&c=woXhAma2lK2q7dpU79Kec1KLGZZyf4eh0xEZlv8O-8Y=",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // đổi ảnh sau 4 giây
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      <Header />
      {/* Hero Section */}
      <div
        style={{
          width: "100%",
          height: "300px",
          backgroundImage: `url(${images[currentIndex]})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          transition: "background-image 1s ease-in-out",
        }}
      >
        {/* <h1>Chào mừng đến với SciFun</h1> */}
      </div>
      <Lessons />
      <Footer />
    </>
  );
};

export default Home;
