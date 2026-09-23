import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 1. Regular Icons (Nét mảnh/rỗng)
import { 
  faHeart as farHeart,
  faStar as farStar // Sao rỗng cho đánh giá
} from '@fortawesome/free-regular-svg-icons'

// 2. Solid Icons (Nét đặc)
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
  faStar as fasStar, // Sao đặc
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
  faArrowRight
} from '@fortawesome/free-solid-svg-icons'

const icons = [
  faBars, faLocationDot, faPhone, faEnvelope, fasHeart, farHeart, farStar,
  faChartPie, faComments, faBoxArchive, faFileInvoiceDollar,
  faCreditCard, faTags, faTicket, faUsersGear, faArrowLeft,
  faChartLine, faSackDollar, faCartShopping, faUsers, 
  fasStar, faCalendarDays, faImage,
  faWandMagicSparkles, faBullseye, faBolt, faUserTie, faUserGear, faUserCheck,
  faReceipt, faBoxesStacked, faBan, faClock, faClipboardList,
  faFire, faCheck, faArrowRight
]

library.add(...icons)

export { FontAwesomeIcon }