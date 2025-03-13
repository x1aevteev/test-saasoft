export type selectType = 'LDAP' | 'local'

export type user = {
    labels: Array<string> | null
    select: selectType | null
    login: string | null
    password: string | null
}