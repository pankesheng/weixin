
package com.thanone.netmanager.service.ws;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.annotation.XmlElementDecl;
import javax.xml.bind.annotation.XmlRegistry;
import javax.xml.namespace.QName;


/**
 * This object contains factory methods for each 
 * Java content interface and Java element interface 
 * generated in the com.thanone.netmanager.service.ws package. 
 * <p>An ObjectFactory allows you to programatically 
 * construct new instances of the Java representation 
 * for XML content. The Java representation of XML 
 * content can consist of schema derived interfaces 
 * and classes representing the binding of schema 
 * type definitions, element declarations and model 
 * groups.  Factory methods for each of these are 
 * provided in this class.
 * 
 */
@XmlRegistry
public class ObjectFactory {

    private final static QName _TelAcOnResponse_QNAME = new QName("http://ws.service.netmanager.thanone.com/", "telAcOnResponse");
    private final static QName _TelCnsOff_QNAME = new QName("http://ws.service.netmanager.thanone.com/", "telCnsOff");
    private final static QName _TelCnsOffResponse_QNAME = new QName("http://ws.service.netmanager.thanone.com/", "telCnsOffResponse");
    private final static QName _Check_QNAME = new QName("http://ws.service.netmanager.thanone.com/", "check");
    private final static QName _TelCnsOn_QNAME = new QName("http://ws.service.netmanager.thanone.com/", "telCnsOn");
    private final static QName _TelAcOff_QNAME = new QName("http://ws.service.netmanager.thanone.com/", "telAcOff");
    private final static QName _TelAcOffResponse_QNAME = new QName("http://ws.service.netmanager.thanone.com/", "telAcOffResponse");
    private final static QName _CheckResponse_QNAME = new QName("http://ws.service.netmanager.thanone.com/", "checkResponse");
    private final static QName _GetTokenResponse_QNAME = new QName("http://ws.service.netmanager.thanone.com/", "getTokenResponse");
    private final static QName _GetToken_QNAME = new QName("http://ws.service.netmanager.thanone.com/", "getToken");
    private final static QName _TelAcOn_QNAME = new QName("http://ws.service.netmanager.thanone.com/", "telAcOn");
    private final static QName _TelCnsOnResponse_QNAME = new QName("http://ws.service.netmanager.thanone.com/", "telCnsOnResponse");

    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: com.thanone.netmanager.service.ws
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link CheckResponse }
     * 
     */
    public CheckResponse createCheckResponse() {
        return new CheckResponse();
    }

    /**
     * Create an instance of {@link TelCnsOn }
     * 
     */
    public TelCnsOn createTelCnsOn() {
        return new TelCnsOn();
    }

    /**
     * Create an instance of {@link TelAcOffResponse }
     * 
     */
    public TelAcOffResponse createTelAcOffResponse() {
        return new TelAcOffResponse();
    }

    /**
     * Create an instance of {@link TelAcOff }
     * 
     */
    public TelAcOff createTelAcOff() {
        return new TelAcOff();
    }

    /**
     * Create an instance of {@link Check }
     * 
     */
    public Check createCheck() {
        return new Check();
    }

    /**
     * Create an instance of {@link TelCnsOffResponse }
     * 
     */
    public TelCnsOffResponse createTelCnsOffResponse() {
        return new TelCnsOffResponse();
    }

    /**
     * Create an instance of {@link TelCnsOff }
     * 
     */
    public TelCnsOff createTelCnsOff() {
        return new TelCnsOff();
    }

    /**
     * Create an instance of {@link TelAcOnResponse }
     * 
     */
    public TelAcOnResponse createTelAcOnResponse() {
        return new TelAcOnResponse();
    }

    /**
     * Create an instance of {@link TelCnsOnResponse }
     * 
     */
    public TelCnsOnResponse createTelCnsOnResponse() {
        return new TelCnsOnResponse();
    }

    /**
     * Create an instance of {@link TelAcOn }
     * 
     */
    public TelAcOn createTelAcOn() {
        return new TelAcOn();
    }

    /**
     * Create an instance of {@link GetToken }
     * 
     */
    public GetToken createGetToken() {
        return new GetToken();
    }

    /**
     * Create an instance of {@link GetTokenResponse }
     * 
     */
    public GetTokenResponse createGetTokenResponse() {
        return new GetTokenResponse();
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link TelAcOnResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://ws.service.netmanager.thanone.com/", name = "telAcOnResponse")
    public JAXBElement<TelAcOnResponse> createTelAcOnResponse(TelAcOnResponse value) {
        return new JAXBElement<TelAcOnResponse>(_TelAcOnResponse_QNAME, TelAcOnResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link TelCnsOff }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://ws.service.netmanager.thanone.com/", name = "telCnsOff")
    public JAXBElement<TelCnsOff> createTelCnsOff(TelCnsOff value) {
        return new JAXBElement<TelCnsOff>(_TelCnsOff_QNAME, TelCnsOff.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link TelCnsOffResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://ws.service.netmanager.thanone.com/", name = "telCnsOffResponse")
    public JAXBElement<TelCnsOffResponse> createTelCnsOffResponse(TelCnsOffResponse value) {
        return new JAXBElement<TelCnsOffResponse>(_TelCnsOffResponse_QNAME, TelCnsOffResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link Check }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://ws.service.netmanager.thanone.com/", name = "check")
    public JAXBElement<Check> createCheck(Check value) {
        return new JAXBElement<Check>(_Check_QNAME, Check.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link TelCnsOn }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://ws.service.netmanager.thanone.com/", name = "telCnsOn")
    public JAXBElement<TelCnsOn> createTelCnsOn(TelCnsOn value) {
        return new JAXBElement<TelCnsOn>(_TelCnsOn_QNAME, TelCnsOn.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link TelAcOff }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://ws.service.netmanager.thanone.com/", name = "telAcOff")
    public JAXBElement<TelAcOff> createTelAcOff(TelAcOff value) {
        return new JAXBElement<TelAcOff>(_TelAcOff_QNAME, TelAcOff.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link TelAcOffResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://ws.service.netmanager.thanone.com/", name = "telAcOffResponse")
    public JAXBElement<TelAcOffResponse> createTelAcOffResponse(TelAcOffResponse value) {
        return new JAXBElement<TelAcOffResponse>(_TelAcOffResponse_QNAME, TelAcOffResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link CheckResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://ws.service.netmanager.thanone.com/", name = "checkResponse")
    public JAXBElement<CheckResponse> createCheckResponse(CheckResponse value) {
        return new JAXBElement<CheckResponse>(_CheckResponse_QNAME, CheckResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetTokenResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://ws.service.netmanager.thanone.com/", name = "getTokenResponse")
    public JAXBElement<GetTokenResponse> createGetTokenResponse(GetTokenResponse value) {
        return new JAXBElement<GetTokenResponse>(_GetTokenResponse_QNAME, GetTokenResponse.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link GetToken }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://ws.service.netmanager.thanone.com/", name = "getToken")
    public JAXBElement<GetToken> createGetToken(GetToken value) {
        return new JAXBElement<GetToken>(_GetToken_QNAME, GetToken.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link TelAcOn }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://ws.service.netmanager.thanone.com/", name = "telAcOn")
    public JAXBElement<TelAcOn> createTelAcOn(TelAcOn value) {
        return new JAXBElement<TelAcOn>(_TelAcOn_QNAME, TelAcOn.class, null, value);
    }

    /**
     * Create an instance of {@link JAXBElement }{@code <}{@link TelCnsOnResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://ws.service.netmanager.thanone.com/", name = "telCnsOnResponse")
    public JAXBElement<TelCnsOnResponse> createTelCnsOnResponse(TelCnsOnResponse value) {
        return new JAXBElement<TelCnsOnResponse>(_TelCnsOnResponse_QNAME, TelCnsOnResponse.class, null, value);
    }

}
