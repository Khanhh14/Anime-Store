import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faBars, 
  faLocationDot, 
  faPhone, 
  faEnvelope 
} from '@fortawesome/free-solid-svg-icons'

library.add(faBars, faLocationDot, faPhone, faEnvelope)

export { FontAwesomeIcon }