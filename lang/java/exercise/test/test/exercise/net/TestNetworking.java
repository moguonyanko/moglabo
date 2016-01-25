package test.exercise.net;

import java.net.MalformedURLException;
import java.net.URL;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

public class TestNetworking {
	
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
	
	private URL getSampleURL() throws MalformedURLException{
		String protocol = "http";
		int port = 80;
		String host = "localhost";
		String userInfo = "testuser:testpassword";
		
		return new URL(protocol, userInfo + "@" + host, 
			port, "/webcise/studyinghtml5/websocket/index.html?id=12345#ResultArea");
	}
	
	@Test
	public void URLから情報を取得する() throws MalformedURLException{
		URL url = getSampleURL();
		
		System.out.println("getProtocol=" + url.getProtocol());
		System.out.println("getHost=" + url.getHost());
		System.out.println("getPort=" + url.getPort());
		System.out.println("getDefaultPort=" + url.getDefaultPort());
		System.out.println("getQuery=" + url.getQuery());
		System.out.println("getPath=" + url.getPath());
		System.out.println("getRef=" + url.getRef());
		/**
		 * getUserInfoが常にnullになってしまう。
		 */
		System.out.println("getUserInfo=" + url.getUserInfo());
		System.out.println("getAuthority=" + url.getAuthority());
		System.out.println("getFile=" + url.getFile());
		
		System.out.println(url);
	}
	
}
