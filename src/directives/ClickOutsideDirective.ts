import Vue, { VNode } from 'vue';
import { DirectiveBinding } from 'vue/types/options';

Vue.directive('click-outside', {
    bind: function bindClikOutsideDirective(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {

        let callBackFunction = binding.value;

        const handleOutsideClick = function(e : Event) {
            e.stopPropagation();
            if(!el.contains(e.target as Element)) {
                callBackFunction();
            }
        };
        el['handleOutsideClick'] = handleOutsideClick;
        
        document.addEventListener('click', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);
    },
    unbind: function unbindClikOutsideDirective(el: HTMLElement) {
        let functionToUnbind = el['handleOutsideClick'];
        document.removeEventListener('click', functionToUnbind);
        document.removeEventListener('touchstart', functionToUnbind);
    }
  });