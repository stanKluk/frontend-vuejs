<template>
    <b-container fluid @keyup.enter="fetchUsersData">
        <fixed-background variant="1"></fixed-background>
        <div class="med-kiss-container pt-5">
               <section class="form-content">

                   <b-row class="form-title">
                       <b-col>
                           <h2>Gestion des utilisateurs</h2>
                       </b-col>
                   </b-row>

                   <b-row>
                       <b-col>
                           <b-alert show variant="default">
                                <p class="font-weight-bold">
                                    Gestion des droits
                                </p>
                                <p>
                                    Vous pouvez modifier les droits des utilisateurs en les éditant à partir de la liste ci-dessous.
                                </p>
                                <p>
                                    Vous pouvez ajouter de nouveaux utilisateurs en les recherchant avec leur login Windows
                                </p>
                              
                           </b-alert>
                       </b-col>
                    </b-row>
                    <template v-if="$session.hasAuthority('PRIVILEGE_ROOT')">

                        <b-row class="mb-3">
                            <b-col>
                                <b-input-group>
                                    <b-form-input
                                        id="login"
                                        aria-describedby="login-input-live-help"
                                        v-model="searchedUsername"
                                        placeholder="Login utilisateur"
                                    ></b-form-input>
                                    <b-input-group-append>
                                        <b-button @click="fetchUsersData" :disabled="!searchedUsername" variant="primary">
                                            Rechercher
                                        </b-button>
                                    </b-input-group-append>
                                </b-input-group>
                                <b-form-text id="login-input-live-help">Veuillez saisir le login windows de l'utilisateur à rechercher</b-form-text>
                            </b-col>
                        </b-row>

                        <b-row>
                            <b-col>
                                <b-table 
                                    id="adminUsersTable" 
                                    class="form-table"
                                    responsive 
                                    :items="adminUsers" 
                                    selectable
                                    select-mode="single"
                                    @row-selected="onRowSelected"
                                ></b-table>
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

                        <b-row class="button-bar">
                            <b-col>
                                <b-button to="/management/users/add" variant="primary" size="lg">
                                    <font-awesome-icon icon="plus" />
                                    Ajouter un utilisateur
                                </b-button>
                            </b-col>
                        </b-row>

                    </template>
					 
               </section>

            </div>
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
export default class UserManagement extends Vue {

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

    private searchedUsername : string = '';

    constructor() {
        super();
    }

    mounted() {
        if(this.$session.hasAuthority('PRIVILEGE_GRANT'))
            this.fetchUsersData();
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
    private fetchUsersData() {
        this.$http.post('/api/users/usersList', {
            page: this.adminUsersCurrentPage,
            perPage : this.adminUsersPerPage,
            filter: this.searchedUsername
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


    private onRowSelected(selectedRowArray) {
        let selectedUser = selectedRowArray[0].username;
        this.$router.push('/management/users/edit/' + selectedUser);
    }

}
</script>


<style>

</style>
