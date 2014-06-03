package test.webcise.ws.example.greeting;

import org.apache.cxf.jaxrs.client.WebClient;
import org.apache.openejb.jee.SingletonBean;
import org.apache.openejb.junit.ApplicationComposer;
import org.apache.openejb.junit.Module;
import org.apache.openejb.testing.EnableServices;
import static org.hamcrest.CoreMatchers.is;
import org.junit.After;
import org.junit.AfterClass;
import static org.junit.Assert.assertThat;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import webcise.ws.example.greeting.GreetingService;

@EnableServices(value = "jaxrs")
@RunWith(ApplicationComposer.class)
public class GreetingServiceTest {

	@Module
	public SingletonBean app() {
		return (SingletonBean) new SingletonBean(GreetingService.class).localBean();
	}

	public GreetingServiceTest() {
	}

	@BeforeClass
	public static void setUpClass() {
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
	public void greetngGET() {
		final String actual = WebClient.create("http://localhost:4204").
			path("/GreetingServletTest/greeting/").
			get(String.class);
		
		final String expected = "Hello, REST!";
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void greetingPOST(){
		
	}
}
