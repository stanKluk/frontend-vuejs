import Vue from 'vue'

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faTrash, faPen, faFilePdf, faFileExcel, faTable, faSync, faChevronLeft, faChevronRight, faComment, faCalendar, faStepBackward, faCaretLeft, faCaretRight, faStepForward, faEye, faBell, faInfoCircle, faPowerOff, faUser, faChevronDown, faSlidersH, faTimes, faChevronUp, faFileDownload, faSpinner } from '@fortawesome/free-solid-svg-icons';
/* import { faFilePdf } from '@fortawesome/free-regular-svg-icons'; */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

/**
 * https://www.npmjs.com/package/@fortawesome/vue-fontawesome
 * Why use the concept of a library?
Explicitly selecting icons offer the advantage of only bundling the icons that you use in your final bundled file. This allows us to subset Font Awesome's thousands of icons to just the small number that are normally used.

Import the specific icons that you need
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { faSpinner } from '@fortawesome/pro-light-svg-icons'
 
library.add(faCoffee, faSpinner)
Import the same icon from different styles
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee as fasCoffee } from '@fortawesome/pro-solid-svg-icons'
import { faCoffee as farCoffee } from '@fortawesome/pro-regular-svg-icons'
import { faCoffee as falCoffee } from '@fortawesome/pro-light-svg-icons'
 */

library.add(faPlus)
library.add(faTrash)
library.add(faPen)
library.add(faFilePdf)
library.add(faFileExcel)
library.add(faTable)
library.add(faSync)
library.add(faChevronLeft)
library.add(faChevronRight)
library.add(faChevronDown)
library.add(faChevronUp)
library.add(faComment)
library.add(faCalendar)
library.add(faStepBackward)
library.add(faStepForward)
library.add(faCaretLeft)
library.add(faCaretRight)
library.add(faEye)
library.add(faBell)
library.add(faInfoCircle)
library.add(faPowerOff)
library.add(faUser)
library.add(faSlidersH)
library.add(faTimes)
library.add(faFileDownload)
library.add(faSpinner)
library.add(faTrash)

Vue.component('font-awesome-icon', FontAwesomeIcon)
