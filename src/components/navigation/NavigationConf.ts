export interface NavigationConf {
    title : string;
    defaultPlaceholder : string;
    menu : {
        [key in MenuType]: NavigationMenu[]
    };
}

export interface NavigationMenu {
    placeholder : string;
    labelKey : string;
    subMenu : NavigationMenu[];
    separator : boolean;
    dataName : string;
    value: string;
    eventName : string;
    icon : MenuIcon;
}

export interface MenuIcon {
    name : string;
    type : string;
}

export enum MenuType {
    APPLICATION = 'APPLICATION',
    ACCOUNT = 'ACCOUNT',
    LANG = 'LANG'
}
