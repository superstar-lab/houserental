/** */
export default class RegisterModel {

    constructor(peopleId, lastName, firstName, genderId, birthDate, typeUserRegisterId, login, password, provider, providerId, imageUrl) {
        this.peopleId = peopleId;
        this.lastName = lastName;
        this.firstName = firstName;
        this.genderId = genderId;
        this.birthDate = birthDate;
        this.typeUserRegisterId = typeUserRegisterId;
        this.login = login;
        this.password = password;

        this.provider = provider; //Facebook, Google
        this.providerId = providerId;
        this.imageUrl = imageUrl;
    }
}