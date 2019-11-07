<template>
    <b-container fluid @keyup.enter="searchUser">
        <fixed-background variant="1"></fixed-background>
        <div class="med-kiss-container pt-5">
               <section class="form-content">

                   <b-row class="form-title">
                       <b-col>
                           <h2>Ajout / Edition d'un utilisateur</h2>
                       </b-col>
                   </b-row>

                   <b-row>
                       <b-col>
                           <b-alert show variant="default">
                                <p class="font-weight-bold">
                                    Gestion des droits
                                </p>
                                <p>
                                    Vous possédez les droits suivants sur les autres utilisateurs :
                                </p>
                                <p>
                                    <ul>
                                        <li v-for="(authorisation,index) in authorisationList" :key="index">
                                            <span class="font-weight-bold">{{authorisation.title}}</span> :
                                            {{authorisation.description}}
                                        </li>
                                    </ul>
                                </p>
                              
                           </b-alert>
                       </b-col>
                    </b-row>

                   <b-row>
                        <b-col>
                            <h3 class="title-border">
                                Rechercher
                            </h3>
                        </b-col>
                    </b-row>

                    <b-row>
                        <b-col>
                            <label for="login">Login windows*</label>
                            <b-input-group>
                                <b-form-input
                                    id="login"
                                    aria-describedby="login-input-live-help"
                                    v-model="searchedUsername"
                                    placeholder="Login"
                                ></b-form-input>
                                <b-input-group-append>
                                    <b-button @click="searchUser" :disabled="!searchedUsername" variant="primary">
                                        Rechercher
                                    </b-button>
                                </b-input-group-append>
                            </b-input-group>
                            <b-form-text id="login-input-live-help">Veuillez saisir le login windows de l'utilisateur à rajouter</b-form-text>
                            <b-form-invalid-feedback :state="userFound">
                                L'utilisateur n'a pas été trouvé dans l'annuaire
                            </b-form-invalid-feedback>
                        </b-col>
                    </b-row>

                    <template v-if="editedUser != null">
                        <b-row>
                            <b-col>
                                <h3 class="title-border">
                                    Utilisateur
                                </h3>
                            </b-col>
                        </b-row>

                        <b-row>
                            <b-col sm="6">
                                <b-form-group>
                                    <label for="login">Identifiant</label>
                                    <b-form-input id="login" readonly :value="editedUser.username" placeholder="Identifiant"></b-form-input>
                                </b-form-group>
                            </b-col>
                        </b-row>

                        <b-row>
                            <b-col sm="6">
                                <b-form-group>
                                    <label for="firstName">Prénom</label>
                                    <b-form-input id="firstName" readonly :value="editedUser.firstName"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col sm="6">
                                <b-form-group>
                                    <label for="lastName">Nom</label>
                                    <b-form-input id="lastName" readonly :value="editedUser.lastName"></b-form-input>
                                </b-form-group>
                            </b-col>
                        </b-row>

                        <b-row>
                            <b-col sm="6">
                                <b-form-group>
                                    <label for="mail">Mail</label>
                                    <b-form-input id="mail" readonly :value="editedUser.mail"></b-form-input>
                                </b-form-group>
                            </b-col>
                            <b-col sm="6">
                                <b-form-group>
                                    <label for="phone">Téléphone</label>
                                    <b-form-input id="phone" readonly :value="editedUser.phone"></b-form-input>
                                </b-form-group>
                            </b-col>
                        </b-row>

                        <b-row>
                            <b-col>
                                <b-form-group>
                                    <label for="privilege">Privilèges</label>
                                    <b-form-select id="privilege" 
                                        v-model="editedUserPrivilege" 
                                        :options="selectAuthoritiesOptions"
                                        :disabled="!canEditUserPrivilege"
                                    ></b-form-select>
                                </b-form-group>
                            </b-col>
                        </b-row>

                        <b-row v-if="!canEditUserPrivilege">
                            <b-col>
                                <b-alert show variant="warning">
                                    <p class="font-weight-bold">
                                        Droits insuffisants
                                    </p>
                                    <p>
                                        Vous ne disposez pas des privilèges nécessaires pour éditer cet utilisateur
                                    </p>
                                </b-alert>
                            </b-col>
                        </b-row>

                    </template>

                    <b-row v-if="savedUser" class="mt-3">
                        <b-col>
                            <b-alert show variant="info">
                                <p class="font-weight-bold">
                                    Utilisateur sauvegardé
                                </p>
                                <p>
                                    La modification a bien été enregistrée
                                </p>
                            </b-alert>
                        </b-col>
                    </b-row>

                    <b-row class="button-bar">
                        <b-col>
                            <b-button to="/management/users" size="lg" variant="default">Annuler</b-button>
                            <b-button 
                                v-show="canEditUserPrivilege" 
                                @click="saveUser"
                                size="lg" 
                                variant="primary"
                            >Enregistrer</b-button>
                        </b-col>
                    </b-row>
					 
               </section>

            </div>
    </b-container>
</template>


<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import FixedBackground from '@/components/FixedBackground.vue';
import { AxiosResponse } from 'axios';

interface UserVo {
    firstName: string;
    lastName: string;
    username: string;
    company: string;
    mail: string;
    phone: string;
    authorities: string[];
}

@Component({components : {
        FixedBackground
    }
})
export default class AddUser extends Vue {

    private authDescription : object = {
        "PRIVILEGE_ROOT" : {
            description : "privilege.root.description",
            title : "privilege.root.title",
            weight: 0
        },
        "PRIVILEGE_GRANT" : {
            description : "privilege.grant.description",
            title : "privilege.grant.title",
            weight: 1
        },
        "PRIVILEGE_WRITE" : {
            description : "privilege.write.description",
            title : "privilege.write.title",
            weight: 2
        },
        "PRIVILEGE_READ" : {
            description : "privilege.read.description",
            title : "privilege.read.title",
            weight: 3
        },
        "PRIVILEGE_NONE" : {
            //for unregistered users
            description : "privilege.none.description",
            title : "privilege.none.title",
            weight: 10
        }
    }

    private searchedUsername : string = '';
    private userFound : boolean = true;
    private editedUser : UserVo | null = null;
    private editedUserPrivilege : string | null = null;
    private editedUserInitPrivilege : string | null = null;

    private savedUser : boolean = false;

    private adminUsers : [] = [];
    private adminUsersTotalRows : number = 0;
    private adminUsersCurrentPage : number = 1;
    private adminUsersPerPage : number = 5;

    constructor() {
        super();
    }

    mounted() {
        if(this.$session.hasAuthority('PRIVILEGE_GRANT') && this.$route.params['user']) {
            this.searchedUsername = this.$route.params['user'];
            this.searchUser();
        }
    }

    private get authorisationList() : object[] {
        let authList : object[] = [];
        let authKeys = Object.keys(this.authDescription);
        for(let i=0 ; i<authKeys.length ; i++) {
            let authCode = authKeys[i];
            if(this.$session.hasAuthority(authCode)) {
                authList.push(
                    {
                        code : authCode,
                        description : this.$t(this.authDescription[authCode].description),
                        title : this.$t(this.authDescription[authCode].title)
                    }
                )
            }
        }

        return authList;
    }

    private searchUser()  {
        this.savedUser = false;

        if(!this.$session.hasAuthority('PRIVILEGE_GRANT'))
            return;


        if(!this.searchedUsername)
            return;

        const params = new URLSearchParams();
        params.append('username', this.searchedUsername);

        this.$http.post('/api/users/user', params).then((response : AxiosResponse) => {
            this.userFound = true;
            this.editedUser = response.data;
            this.editedUserPrivilege = this.editedUserMaxAuth();
            this.editedUserInitPrivilege = this.editedUserPrivilege;
        }).catch((error : any) => {
            if(error.status == 404) {
                this.userFound = false;
            }
            this.editedUser = null;
            this.editedUserPrivilege = 'PRIVILEGE_NONE';
            this.editedUserInitPrivilege = 'PRIVILEGE_NONE';
        });
    }

    private editedUserMaxAuth() : string {
        let maxAuth = 'PRIVILEGE_NONE';
        if(this.editedUser) {
        let authKeys = Object.keys(this.authDescription);
            for(let i=0 ; i<authKeys.length ; i++) {
                if(this.editedUser.authorities.indexOf(authKeys[i]) > -1) {
                    maxAuth = authKeys[i];
                    break;
                }
            }
        }

        return maxAuth;
    }

    private currentUserMaxAuth() : string {
        let authKeys = Object.keys(this.authDescription);
        for(let i=0 ; i<authKeys.length ; i++) {
            if(this.$session.hasAuthority(authKeys[i])) {
                return authKeys[i];
            }
        }
        return 'PRIVILEGE_NONE';
    }

    private get selectAuthoritiesOptions() : object[] {
        if(this.editedUser == null)
            return [];

        let options : object[] = [];

        let currentUserMaxAuth = this.currentUserMaxAuth();
        let currentUserMaxAuthWeight : number = this.authDescription[currentUserMaxAuth].weight;

        let authKeys = Object.keys(this.authDescription);
        for(let i=0 ; i<authKeys.length ; i++) {
            let auth = authKeys[i];
            options.push(
                {
                    value: auth,
                    text : this.$t(this.authDescription[auth].title),
                    disabled : this.authDescription[auth].weight < currentUserMaxAuthWeight 
                }
            );
        }
        return options;
    }

    private get canEditUserPrivilege() : boolean {
        if(this.editedUser == null)
            return false;

        let currentUserMaxAuth = this.currentUserMaxAuth();
        let currentUserMaxAuthWeight : number = this.authDescription[currentUserMaxAuth].weight;

        let editedUserMaxAuth = this.editedUserMaxAuth();
        let editedUserMaxAuthWeight  : number = this.authDescription[editedUserMaxAuth].weight;

        return currentUserMaxAuthWeight < editedUserMaxAuthWeight ;
    }

    private saveUser() {
        if(this.$session.hasAuthority('PRIVILEGE_GRANT') && this.editedUser != null && this.editedUserPrivilege != null) {
            const params = new URLSearchParams();
            params.append('username', this.editedUser.username);
            params.append('authority', this.editedUserPrivilege);

            this.$http.post('/api/users/save', params).then((response : AxiosResponse) => {
                this.editedUser = null;
                this.editedUserPrivilege = null;
                this.editedUserInitPrivilege = null;
                this.savedUser = true;
            }).catch((error : any) => {
                if(error.status == 404) {
                    this.userFound = false;
                }
                this.editedUser = null;
                this.editedUserPrivilege = null;
                this.editedUserInitPrivilege = null;
            });
        }
    }

}
</script>


<style>

</style>
