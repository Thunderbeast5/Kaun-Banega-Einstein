import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Organizers from '../components/Organizers';
import About from '../components/About';
import KBESyllabus from '../components/KBESyllabus';
// import Structure from '../components/Structure';
// import RocketLaunch from '../components/RocketLaunch';
import ISROPrize from '../components/ISROPrize';
import Contact from '../components/Contact';
import Footer from '../components/Footer'; 
import PosterModal from '../components/PosterModal';
import svicsmPoster from '../assets/svicsm-poster.webp';

const LandingPage = () => {
  return (
    <>
      <PosterModal image={svicsmPoster} alt="SVICSM announcement poster" />
      <Navbar />
      <Hero />
      <Organizers />
      <About />
      <KBESyllabus />
      {/* <Structure />
      <RocketLaunch /> */}
      <ISROPrize />
      <Contact />
   
      <Footer />
    </>
  );
};

export default LandingPage;