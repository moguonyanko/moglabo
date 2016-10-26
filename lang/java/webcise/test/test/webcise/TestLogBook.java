package test.webcise;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Supplier;

import org.junit.Test;
import org.junit.BeforeClass;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public class TestLogBook {
	
	private static final String TOP_PAGE_URL = "http://localhost/logbook/";
	
	private static final Map<String, Supplier<WebDriver>> DRIVER_SUPPLIERS = new HashMap<>();
	
	@BeforeClass
	public static void setUpClass() {
		DRIVER_SUPPLIERS.put("default", FirefoxDriver::new);
	}
	
	private WebDriver getWebDriver(String name){
		return DRIVER_SUPPLIERS.get(name).get();
	}
	
	private WebDriver getWebDriver(){
		return getWebDriver("default");
	}
	
	@Test
	public void トップページにアクセスできる(){
		WebDriver driver = getWebDriver();
		driver.get(TOP_PAGE_URL);
	}
	
}
