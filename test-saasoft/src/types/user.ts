export type selectType = 'LDAP' | 'local'

export type user = {
    labels: { text: string; }[] | null
    select: selectType | null
    login: string | null
    password: string | null
    [key: string]: any 
}