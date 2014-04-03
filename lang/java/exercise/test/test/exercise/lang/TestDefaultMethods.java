package test.exercise.lang;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import exercise.lang.lambda.Excise;
import exercise.lang.lambda.Favorable;
import exercise.lang.lambda.ShopItem;
import exercise.lang.lambda.Tax;
import exercise.lang.lambda.Taxable;

public class TestDefaultMethods {
	
	public TestDefaultMethods() {
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
	public void デフォルトの税金計算が出来る(){
		Tax tax = new Excise();
		
		Taxable item = new ShopItem("Apple", 100);
		
		int actual = tax.on(item);
		int expected = 108;
		
		assertThat(actual, is(expected));
	}
	
	@Test
	public void 優遇される金額が得られる(){
		Favorable f = new ShopItem("Apple", 100); 
		
		int actual = f.getValue();
		int expected = 0;
		
		assertThat(actual, is(expected));
	}
}
