export class BillingAddress {
    address1;
    address2;
    zip;
    city;
    companyName;
    phone;
    constructor(address1, address2, zip, city, companyName, phone) {
        this.address1 = address1;
        this.address2 = address2;
        this.zip = zip;
        this.city = city;
        this.companyName = companyName;
        this.phone = phone;
    }
}
