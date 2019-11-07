<template>
    <b-container fluid="">
        <fixed-background variant="1"></fixed-background>
        <form class="med-kiss-container pt-5">
               <section class="form-content">

                   <b-row class="form-title">
                       <b-col>
                           <h2>Mon compte</h2>
                       </b-col>
                   </b-row>

                   <b-row v-if="$session.hasAuthority('PRIVILEGE_READ')">
                       <b-col>
                           <h3 class="title-border">
                                Autorisations
                            </h3>
                       </b-col>
                   </b-row>

                   <b-row>
                       <b-col>
                            <b-table-lite responsive :items="authorisationList" class="form-table"></b-table-lite>
                       </b-col>
                   </b-row>

                   <b-row>
                       <b-col>
                           <b-alert show variant="default">
                                <p class="font-weight-bold">
                                    Demande d'autorisation
                                </p>
                                <p v-if="$session.hasAuthority('PRIVILEGE_ROOT')">
                                   Vous pouvez accorder des droits supplémentaires aux autres utilisateurs via 
                                   l'onglet Profil > Gestion des utilisateurs
                                
                                </p>
                                <p v-if="!$session.hasAuthority('PRIVILEGE_READ')">
                                   Vous n'avez aucun privilège.
                                </p>
                                <p v-if="!$session.hasAuthority('PRIVILEGE_ROOT')">
                                   Vous pouvez demander des autorisations supplémentaires en contactant un des administrateurs de la liste
                                </p>
                           </b-alert>
                       </b-col>
                    </b-row>
                    <template v-if="!$session.hasAuthority('PRIVILEGE_ROOT')">
                        <b-row>
                            <b-col>
                                <h3 class="title-border">
                                        Administrateurs
                                    </h3>
                            </b-col>
                        </b-row>

                        <b-row>
                            <b-col>
                                    <b-table-lite responsive id="adminUsersTable" :items="adminUsers" class="form-table"></b-table-lite>
                            </b-col>
                        </b-row>

                        <b-row>
                            <b-col>
                                <b-pagination
                                    limit="20"
                                    align="fill"
                                    v-model="adminUsersCurrentPage"
                                    :total-rows="adminUsersTotalRows"
                                    :per-page="adminUsersPerPage"
                                    aria-controls="adminUsersTable"
                                    ></b-pagination>
                            </b-col>
                        </b-row>
                    </template>
					 
               </section>

            </form>
    </b-container>
</template>


<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import FixedBackground from '@/components/FixedBackground.vue';
import { AxiosResponse } from 'axios';

@Component({components : {
        FixedBackground
    }
})
export default class Profile extends Vue {

    private authDescription : object = {
        "PRIVILEGE_ROOT" : "privilege.root.title",
        "PRIVILEGE_GRANT" : "privilege.grant.title",
        "PRIVILEGE_WRITE" : "privilege.write.title",
        "PRIVILEGE_READ" : "privilege.read.title"
    }

    private adminUsers : [] = [];
    private adminUsersTotalRows : number = 0;
    private adminUsersCurrentPage : number = 1;
    private adminUsersPerPage : number = 5;

    constructor() {
        super();
    }

    mounted() {
        this.fetchAdminData();
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
                        description : this.$t(this.authDescription[authCode])
                    }
                )
            }
        }

        return authList;
    }

    @Watch('adminUsersCurrentPage')
    private fetchAdminData() {
        this.$http.post('/api/users/adminList', {
            page: this.adminUsersCurrentPage,
            perPage : this.adminUsersPerPage
        }).then((response : AxiosResponse) => {
            this.adminUsers = response.data.dataList.map((val: any) => ({
                username : val.username,
				mail: val.mail,
				tel: val.phone
            }));
            this.adminUsersTotalRows = response.data.count;
            
        }).catch((error : any) => {
            console.log(error);
        });
    }

}
</script>


<style>

</style>
