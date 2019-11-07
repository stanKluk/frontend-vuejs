import axios, { AxiosStatic} from 'axios';
import Vue from 'vue';
import VueAxios from 'vue-axios';
import router from "@/router";

const axiosInstance = axios.create({
    baseURL : process.env.VUE_APP_API_ENDPOINT
})

axiosInstance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (401 === error.response.status) {
        router.push('/login')
        return error.response;
    } else if (403 === error.response.status) {
        router.push('/forbidden')
        return error.response;
    } else {

        if (
            error.request.responseType === 'blob' &&
            error.response.data instanceof Blob &&
            error.response.data.type &&
            error.response.data.type.toLowerCase().indexOf('json') != -1
          )
          {
            return new Promise((resolve, reject) => {
               let reader = new FileReader();
               reader.onload = () => {
                   error.response.data = JSON.parse(reader.result as string);
                   resolve(Promise.reject(error.response));
               };

               reader.onerror = () => {
                   reject(error.response);
               };

               reader.readAsText(error.response.data);
            });
          };

          return Promise.reject(error.response);

        //continues to the normal catch 
        /* throw error.response; */
    }
});

Vue.use(VueAxios, axiosInstance);

export default axiosInstance;//in case we want to use