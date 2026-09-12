import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Structure from '../components/Structure';
import RocketLaunch from '../components/RocketLaunch';
import ISROPrize from '../components/ISROPrize';
import Contact from '../components/Contact';
import Footer from '../components/Footer'; 

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Structure />
      <RocketLaunch />
      <ISROPrize />
      <Contact />
   
      <Footer />
    </>
  );
};

export default LandingPage;