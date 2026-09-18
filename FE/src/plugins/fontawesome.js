import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 1. Import các icon Solid (Nét đặc)
import { 
  faBars, 
  faLocationDot, 
  faPhone, 
  faEnvelope,
  faHeart as fasHeart,
  // Icon cho Admin Sidebar & Nút bấm
  faChartPie,
  faComments,
  faBoxArchive,
  faFileInvoiceDollar,
  faCreditCard,
  faTags,
  faTicket,
  faUsersGear,
  faArrowLeft
} from '@fortawesome/free-solid-svg-icons'

// 2. Import icon Regular (Nét mảnh/viền rỗng)
import { 
  faHeart as farHeart 
} from '@fortawesome/free-regular-svg-icons'

// Đăng ký toàn bộ vào thư viện
library.add(
  faBars, 
  faLocationDot, 
  faPhone, 
  faEnvelope, 
  fasHeart, 
  farHeart,
  // Admin icons
  faChartPie,
  faComments,
  faBoxArchive,
  faFileInvoiceDollar,
  faCreditCard,
  faTags,
  faTicket,
  faUsersGear,
  faArrowLeft
)

export { FontAwesomeIcon }