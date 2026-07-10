import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import Hero from '../components/Herosection/Hero'
import HowItWorks from '../components/Herosection/HowItworks'
import FeaturedCategories from '../components/Herosection/Featuredcategories'
import StatsBanner from '../components/Herosection/Statsbanner'
import FAQ from '../components/faq/faq'
import AboutUs from '../components/Herosection/AboutUs'
import Footer from '../components/Footer/Footer'

const HomePage = () => {
  return (
    <>
    <Navbar/>
    <Hero/>
        <HowItWorks/>
             <FeaturedCategories/>
             <StatsBanner/>
             <FAQ/>
             <AboutUs/>
             <Footer/>  

    </>
  )
}

export default HomePage