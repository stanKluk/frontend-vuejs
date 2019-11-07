import _Vue from "vue";
import Session from "./session-impl";
import { ISession, SessionPluginOptions } from "./session-impl";

// export type PluginFunction<T> = (Vue: typeof _Vue, options?: T) => void;
export function SessionPlugin<AxiosPlugOptions>(Vue: typeof _Vue, options?: SessionPluginOptions): void {
    // do stuff with options
    Vue.prototype.$session = Session;
}

declare module 'vue/types/vue' {
    interface Vue {
        $session: ISession;
    }
}