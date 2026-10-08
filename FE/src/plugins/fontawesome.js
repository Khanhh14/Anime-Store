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
  faPlus,
  faMinus,
  faXmark,
  // --- THÊM CÁC ICON CHO TRANG ANIME ---
  faBoxOpen,
  faCircleInfo,
  faUserPen,
  faMask,
  faCrown,
  faSpinner
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
  faPlus, faMinus, faXmark,
  // Thêm vào mảng icons
  faBoxOpen, faCircleInfo, faUserPen, faMask, faCrown, faSpinner
]

library.add(...icons)

export { FontAwesomeIcon }