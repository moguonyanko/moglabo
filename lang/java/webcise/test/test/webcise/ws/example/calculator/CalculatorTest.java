package test.webcise.ws.example.calculator;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Properties;
import javax.ejb.embeddable.EJBContainer;
import javax.xml.namespace.QName;
import javax.xml.ws.Service;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.is;

import webcise.ws.example.calculator.CalculatorWs;

public class CalculatorTest {
	
	public CalculatorTest() {
	}
	
	@BeforeClass
	public static void setUpClass() {
		Properties properties = new Properties();
		properties.setProperty("openejb.embedded.remotable", "true");
		//properties.setProperty("httpejbd.print", "true");
		//properties.setProperty("httpejbd.indent.xml", "true");
		EJBContainer.createEJBContainer(properties);
	}
	
	@AfterClass
	public static void tearDownClass() {
	}
	
	@Before
	public void setUp() {
	}
	
	@After
	public void tearDown() {
	}

	@Test
	public void sumで足し算を行うことが出来る() throws MalformedURLException {
		Service calculatorService = Service.create(
			new URL("http://localhost:4204/Calculator?wsdl"), 
			new QName("http://localhost/wsdl", "CalculatorService"));
	
		assertNotNull(calculatorService);
		
		CalculatorWs calculator = calculatorService.getPort(CalculatorWs.class);
		
		int actual = calculator.sum(4, 6);
		int expected = 10;
		
		assertThat(actual, is(expected));
	}

	@Test
	public void multiplyで掛け算を行うことが出来る() {}
	
}
