export class BillingAddress {
    address1?: string;
    address2?: string;
    zip?: string;
    city?: string;
    companyName?: string;
    phone?: string;

    constructor(address1?: string, address2?: string, zip?: string, city?: string, companyName?: string, phone?: string) {
        this.address1 = address1;
        this.address2 = address2;
        this.zip = zip;
        this.city = city;
        this.companyName = companyName;
        this.phone = phone;
    } 
}