export class SessionPluginOptions {
    // add stuff
}

export interface ISession {
    init(username : string, firstName : string, lastName : string, company : string, mail : string, phone : string, authorities : string[]) : void;
    invalidate() : void;
    hasAuthority( ...authorities : string[]) : boolean;
    username : string;
    firstName : string;
    lastName : string;
    company : string;
    mail : string;
    phone : string;
}

export class SessionImpl implements ISession {
    public username : string = '';
    public firstName : string = '';
    public lastName : string = '';
    public company : string = '';
    public mail : string = '';
    public phone : string = '';
    private authorities : string[] = [];

    constructor() {
        let usernameTemp = localStorage.getItem('username');
        if(usernameTemp != null) {
            this.username = usernameTemp;
        }
        let firstNameTemp = localStorage.getItem('firstName');
        if(firstNameTemp != null) {
            this.firstName = firstNameTemp;
        }
        let lastNameTemp = localStorage.getItem('lastName');
        if(lastNameTemp != null) {
            this.lastName = lastNameTemp;
        }
        let companyTemp = localStorage.getItem('company');
        if(companyTemp != null) {
            this.company = companyTemp;
        }
        let mailTemp = localStorage.getItem('mail');
        if(mailTemp != null) {
            this.mail = mailTemp;
        }
        let phoneTemp = localStorage.getItem('phone');
        if(phoneTemp != null) {
            this.phone = phoneTemp;
        }

        let authoritiesTemp = localStorage.getItem('authorities');
        if(authoritiesTemp != null) {
            this.authorities = JSON.parse(authoritiesTemp);
        }
        
    }

    private saveInLocaleStorage() {
        localStorage.setItem('username', this.username);
        localStorage.setItem('firstName', this.firstName);
        localStorage.setItem('lastName', this.lastName);
        localStorage.setItem('company', this.company);
        localStorage.setItem('mail', this.mail);
        localStorage.setItem('phone', this.phone);
        localStorage.setItem('authorities', JSON.stringify(this.authorities));
    }

    init(username : string, firstName : string, lastName : string, company : string, mail : string, phone : string, authorities : string[]) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.company = company;
        this.mail = mail;
        this.phone = phone;
        this.authorities = authorities;
        this.saveInLocaleStorage();
    }

    hasAuthority( authority : string) {
        return this.authorities.indexOf(authority) > -1;
    }

  /*   username() : string {
        return this.usernameValue;
    } */

    invalidate() {
        this.username = "";
        this.firstName = "";
        this.lastName = "";
        this.company = "";
        this.mail = "";
        this.phone = "";
        localStorage.removeItem('username');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        localStorage.removeItem('company');
        localStorage.removeItem('mail');
        localStorage.removeItem('phone');
        localStorage.removeItem('authorities');
    }
}

const Session: SessionImpl = new SessionImpl();

export default Session;
