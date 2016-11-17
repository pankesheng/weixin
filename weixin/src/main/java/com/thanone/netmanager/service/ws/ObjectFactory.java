
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

    private final static QName _Check_QNAME = new QName("http://ws.service.netmanager.thanone.com/", "check");
    private final static QName _TelAc_QNAME = new QName("http://ws.service.netmanager.thanone.com/", "telAc");
    private final static QName _CheckResponse_QNAME = new QName("http://ws.service.netmanager.thanone.com/", "checkResponse");
    private final static QName _TelAcResponse_QNAME = new QName("http://ws.service.netmanager.thanone.com/", "telAcResponse");

    /**
     * Create a new ObjectFactory that can be used to create new instances of schema derived classes for package: com.thanone.netmanager.service.ws
     * 
     */
    public ObjectFactory() {
    }

    /**
     * Create an instance of {@link TelAcResponse }
     * 
     */
    public TelAcResponse createTelAcResponse() {
        return new TelAcResponse();
    }

    /**
     * Create an instance of {@link CheckResponse }
     * 
     */
    public CheckResponse createCheckResponse() {
        return new CheckResponse();
    }

    /**
     * Create an instance of {@link TelAc }
     * 
     */
    public TelAc createTelAc() {
        return new TelAc();
    }

    /**
     * Create an instance of {@link Check }
     * 
     */
    public Check createCheck() {
        return new Check();
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
     * Create an instance of {@link JAXBElement }{@code <}{@link TelAc }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://ws.service.netmanager.thanone.com/", name = "telAc")
    public JAXBElement<TelAc> createTelAc(TelAc value) {
        return new JAXBElement<TelAc>(_TelAc_QNAME, TelAc.class, null, value);
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
     * Create an instance of {@link JAXBElement }{@code <}{@link TelAcResponse }{@code >}}
     * 
     */
    @XmlElementDecl(namespace = "http://ws.service.netmanager.thanone.com/", name = "telAcResponse")
    public JAXBElement<TelAcResponse> createTelAcResponse(TelAcResponse value) {
        return new JAXBElement<TelAcResponse>(_TelAcResponse_QNAME, TelAcResponse.class, null, value);
    }

}
