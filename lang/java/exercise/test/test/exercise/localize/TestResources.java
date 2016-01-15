package test.exercise.localize;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ResourceBundle;
import java.net.MalformedURLException;
import java.util.Locale;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;
import static org.hamcrest.CoreMatchers.*;

import exercise.localize.Resources;

public class TestResources {
	
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
	public void ロケール毎にリソースを読み込む() throws MalformedURLException{
		String baseName = "greeting";
		Path path = Paths.get(baseName + "properties");
		ResourceBundle resource = Resources.getReource(baseName, path);
		
		String jaMorningExpected = "おはようございます";
		String jaMorningActual = resource.getString("morning");
		
		assertThat(jaMorningActual, is(jaMorningExpected));
		
		ResourceBundle enResource = Resources.getReource(baseName, path, Locale.US);
		String enDaytimeExpected = "Hello";
		String enDaytimeActual = enResource.getString("daytime");
		
		assertThat(enDaytimeActual, is(enDaytimeExpected));
		
		ResourceBundle deResource = Resources.getReource(baseName, path, Locale.GERMANY);
		String deEveningExpected = "Guten Abend";
		String deEveningActual = deResource.getString("evening");
		
		assertThat(deEveningActual, is(deEveningExpected));
	}
	
	@Test
	public void メインメソッドの引数からロケールを得てプロパティ一覧を表示する(){
		String baseName = "greeting";
		String lang = "en";
		String cont = "US";
		
		String[] arguments = {baseName, lang, cont};
		
		Resources.main(arguments);
	}
	
}
