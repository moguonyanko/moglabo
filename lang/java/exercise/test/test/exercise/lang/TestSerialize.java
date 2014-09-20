package test.exercise.lang;

import exercise.lang.FakeSingleton;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import static org.hamcrest.CoreMatchers.is;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

public class TestSerialize {
	
	public TestSerialize() {
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
	public void シリアライズ可能なクラスはシングルトンではない(){
		FakeSingleton org = FakeSingleton.INSTANCE;
		FakeSingleton faker;
		
		try{
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			new ObjectOutputStream(baos).writeObject(org);
			ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());
			faker = (FakeSingleton)new ObjectInputStream(bais).readObject();
			
			assertFalse(org == faker);
			assertThat(org.getName(), is(faker.getName()));
		}catch(IOException | ClassNotFoundException ex){
			fail(ex.getMessage());
		}
	}
	
}
