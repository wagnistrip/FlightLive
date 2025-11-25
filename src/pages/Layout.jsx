
import ImgCarousel from '../component/ImgCarousel'
import MidContent from '../component/MidContent'
import Footer from '../component/Footer'
import { useMediaQuery } from '@mui/material';

function Layout() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
   <>
   {
    isMobile ? null :  <ImgCarousel />
   }
   <MidContent/>
   <Footer/>
   </>
  )
}

export default Layout
