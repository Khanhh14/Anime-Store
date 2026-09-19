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
  faImage
} from '@fortawesome/free-solid-svg-icons'

// Gom danh sách toàn bộ icon cần dùng
const icons = [
  // Giao diện chung & Tim
  faBars, faLocationDot, faPhone, faEnvelope, fasHeart, farHeart,
  
  // Admin Navigation & Nút bấm
  faChartPie, faComments, faBoxArchive, faFileInvoiceDollar,
  faCreditCard, faTags, faTicket, faUsersGear, faArrowLeft,
  
  // Biểu đồ & Báo cáo thống kê
  faChartLine, faSackDollar, faCartShopping, faUsers, 
  faStar, faCalendarDays, faImage
]

// Đăng ký toàn bộ vào thư viện Font Awesome
library.add(...icons)

export { FontAwesomeIcon }