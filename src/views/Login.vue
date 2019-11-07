<template>
  <b-container @keyup.enter="redirectToHome" >
    <fixed-background></fixed-background>

    <b-row class="logo small-kiss-container p-0" align-h="end" no-gutters>
      <b-col cols="auto" class="p-0 m-0" align-self="end">
          <lang-dropdown></lang-dropdown>
      </b-col>
    </b-row>

    <b-row class="small-kiss-container mt-3 p-0" align-h="end" no-gutters>
      <b-col cols="auto" class="p-0 m-0" align-self="end">
          <a class="login-help" rel="noopener noreferrer" target="_blank" href="#">
            {{ $t('view.login.link.help') }}
          </a>
      </b-col>
    </b-row>

    <b-form-row class="small-kiss-container form-content">

      <b-row><h2 class="col-sm-12 form-title" translate="">{{ $t('view.login.title') }}</h2></b-row>

      <b-form-group>
        <label for="login">{{ $t('view.login.input.username') }} *</label>
        <b-form-input 
          v-model="login" 
          id="login"
          aria-describedby="authentication-invalide"
        >
        </b-form-input>

        <b-form-invalid-feedback :force-show="authenticationFailed" id="authentication-invalide">
          {{ $t('view.login.message.authentication_failed') }}
        </b-form-invalid-feedback>

      </b-form-group>

      <b-form-group>
        <label for="password">{{ $t('view.login.input.password') }} *</label>
        <b-form-input type="password" v-model="password" id="password"></b-form-input>
      </b-form-group>

      <b-row class="pt-4">
        <b-col align-self="start">
          <!-- <ul id="loginFormLinks" class="m-0 p-0">
            <li><a href="#">{{ $t('view.login.link.lost_username') }}</a></li>
            <li><a href="#">{{ $t('view.login.link.lots_password') }}</a></li>
          </ul> -->
        </b-col>
        <b-col col lg="2" align-self="end">
          <b-button @click="redirectToHome" :disabled="!login || !password" variant="primary" class="float-right">
            {{ $t('view.login.button.login') }}
          </b-button>
        </b-col>
      </b-row>

      <b-row class="version mt-3 pb-0 justify-content-end">
          {{ $t('view.login.label.version') }} :&nbsp;<b>1.0</b>
      </b-row>
      <b-row class="version justify-content-end">
          {{ $t('view.login.label.build_time') }} :&nbsp;<b>2019-08-06 19:06</b>
      </b-row>

    </b-form-row>

    <b-row class="small-kiss-container mt-1 justify-content-center">
      <footer class="required-container">
			  <div class="required-fields">
          {{ $t('view.login.message.required_fields') }}
        </div>
		  </footer>
    </b-row>

  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, PropSync, Model, Watch } from 'vue-property-decorator';
import { AxiosResponse } from 'axios';
import { UserProfile } from '../components/user/UserProfile'
import FixedBackground from '@/components/FixedBackground.vue';
import LangDropdown from './../components/dropdown/LangDropdown.vue'
    
@Component({components : {
    FixedBackground,
    LangDropdown
}})
export default class Login extends Vue {
    private login : string = '';
    private password : string ='';
    private authenticationFailed : boolean = false;

    private redirectToHome() {
        if(!this.login || !this.password) 
            return;

        const params = new URLSearchParams();
        params.append('username', this.login);
        params.append('password', this.password);

        this.$http.post('/auth', params).then((response : AxiosResponse) => {
        if (200 !== response.status) {
            this.authenticationFailed = true;
        } else {
            this.$session.init(
                response.data.username, 
                response.data.firstName, 
                response.data.lastName, 
                response.data.company, 
                response.data.mail, 
                response.data.phone, 
                response.data.authorities);

            this.$router.push('/search/documents');
        }
        }).catch((error : any) => {
            //TODO: afficher l'erreur sur l'écran
            this.authenticationFailed = true;
        });

    }
}
</script>
<style scoped>
.logo {
  height: 69px;
  background: url(../assets/images/logo-sy.svg) no-repeat left top;
  background-size: 190px 69px;
  background-position-y: 5px;
  padding: 0;
  padding-bottom: 5px;/*padding / margin trick to align logo*/
  margin-bottom: -5px;
}
.login-help {
  color: #fff;
  float: right;
  width: auto;
  margin-bottom: 10px;
  font-weight: 600;
  font-size: .9rem;
}

#loginFormLinks {
  list-style: none;
}

.version {
  margin: 0;
  font-size: 0.625rem;
  color: #626262;
}
</style>