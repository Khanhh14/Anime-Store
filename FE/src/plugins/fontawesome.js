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
  // Icon bổ sung cho chi tiết đơn hàng
  faReceipt,
  faBoxesStacked,
  faBan,
  faClock,
  faClipboardList
} from '@fortawesome/free-solid-svg-icons'

const icons = [
  faBars, faLocationDot, faPhone, faEnvelope, fasHeart, farHeart,
  faChartPie, faComments, faBoxArchive, faFileInvoiceDollar,
  faCreditCard, faTags, faTicket, faUsersGear, faArrowLeft,
  faChartLine, faSackDollar, faCartShopping, faUsers, 
  faStar, faCalendarDays, faImage,
  faWandMagicSparkles, faBullseye, faBolt, faUserTie, faUserGear, faUserCheck,
  // Order Detail icoclns
  faReceipt, faBoxesStacked, faBan, faClock, faClipboardList
]

library.add(...icons)

export { FontAwesomeIcon }