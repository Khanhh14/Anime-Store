import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'
import { 
  faBars, 
  faLocationDot, 
  faPhone, 
  faEnvelope, 
  faHeart as fasHeart,
  faChartPie, 
  faChartLine, 
  faComments, 
  faBoxArchive, 
  faFileInvoiceDollar, 
  faCreditCard, 
  faTags, 
  faTicket, 
  faUsersGear, 
  faArrowLeft,
  faSackDollar,
  faCartShopping,
  faUsers,
  faStar,
  faCalendarDays,
  faImage,
  faWandMagicSparkles,
  faBullseye,
  faBolt,
  faUserTie,
  faUserGear,
  faUserCheck,
  faReceipt,
  faBoxesStacked,
  faBan,
  faClock,
  faClipboardList,
  // Icon bổ sung cho HomeView
  faFire,
  faCheck,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons'

const icons = [
  faBars, faLocationDot, faPhone, faEnvelope, fasHeart, farHeart,
  faChartPie, faComments, faBoxArchive, faFileInvoiceDollar,
  faCreditCard, faTags, faTicket, faUsersGear, faArrowLeft,
  faChartLine, faSackDollar, faCartShopping, faUsers, 
  faStar, faCalendarDays, faImage,
  faWandMagicSparkles, faBullseye, faBolt, faUserTie, faUserGear, faUserCheck,
  faReceipt, faBoxesStacked, faBan, faClock, faClipboardList,
  // HomeView icons
  faFire, faCheck, faArrowRight
]

library.add(...icons)

export { FontAwesomeIcon }