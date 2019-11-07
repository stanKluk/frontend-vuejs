/**
 * This part is to quickly configure dependencies which are not in typescript 
 * Quick & dirty solution (when one does not care about the type and just wants to import the library)

NB : Changed tsconfig.json (the Typescript configuration of your project) to allow import in this file
with :
    "noImplicitAny":  false

Whith this step there is no more this message error : 
"Could not find a declaration file for module '...'. 'path/to/project/node_modules/...' implicitly has an 'any' type.)""


For each added dependency, you have to declare it as a component 

cleaner solution with types :
https://medium.com/@chris_72272/migrating-to-typescript-write-a-declaration-file-for-a-third-party-npm-module-b1f75808ed2
 */


import Vue from 'vue';
/* 
not used anymore but use it as an example if some components are not typescripted
import Datepicker from 'vuejs-datepicker';
import {fr} from 'vuejs-datepicker/dist/locale'

//https://www.npmjs.com/package/vuejs-datepicker
Datepicker.language = fr;
Vue.component('datepicker', Datepicker); */