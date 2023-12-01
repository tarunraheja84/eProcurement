interface QuotationProductsDetails {
    supplierPrice : number,
    requestedQty : number,
    acceptedQty : number,
  }

interface UserSession {
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
    picture?: string | null | undefined;
    sub?: string | null | undefined;
    role?: string | null | undefined;
    id?: string | null | undefined;
    iss?: string | null | undefined;
    azp?: string | null | undefined;
    aud?: string | null | undefined;
    hd?: string | null | undefined;
    email_verified?: boolean | null | undefined;
    at_hash?: string | null | undefined;
    given_name?: string | null | undefined;
    family_name?: string | null | undefined;
    locale?: string | null | undefined;
    iat?: number | null | undefined;
    exp?: number | null | undefined;
    userType?: string | null | undefined;
    userId?: string | null | undefined;
    status?: string | null | undefined;
    jti?: string | null | undefined;
}