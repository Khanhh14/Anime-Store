import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 1. Regular Icons
import { 
  faHeart as farHeart,
  faStar as farStar
} from '@fortawesome/free-regular-svg-icons'

// 2. Solid Icons
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
  faStar as fasStar, 
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
  faFire, 
  faCheck, 
  faArrowRight,
  // Icon bổ sung cho CartTab
  faPlus,
  faMinus,
  faXmark
} from '@fortawesome/free-solid-svg-icons'

const icons = [
  faBars, faLocationDot, faPhone, faEnvelope, fasHeart, farHeart, farStar,
  faChartPie, faComments, faBoxArchive, faFileInvoiceDollar,
  faCreditCard, faTags, faTicket, faUsersGear, faArrowLeft,
  faChartLine, faSackDollar, faCartShopping, faUsers, 
  fasStar, faCalendarDays, faImage,
  faWandMagicSparkles, faBullseye, faBolt, faUserTie, faUserGear, faUserCheck,
  faReceipt, faBoxesStacked, faBan, faClock, faClipboardList,
  faFire, faCheck, faArrowRight,
  // Cart icons
  faPlus, faMinus, faXmark
]

library.add(...icons)

export { FontAwesomeIcon }