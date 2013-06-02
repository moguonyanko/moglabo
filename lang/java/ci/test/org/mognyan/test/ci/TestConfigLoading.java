package org.mognyan.test.ci;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;
import org.mognyan.ci.util.LogUtil;

public class TestConfigLoading{
	
	public TestConfigLoading(){
	}
	
	@BeforeClass
	public static void setUpClass(){
	}
	
	@AfterClass
	public static void tearDownClass(){
	}
	
	@Before
	public void setUp(){
	}
	
	@Test
	public void test_logging(){
		try{
			LogUtil.info("test info");
			LogUtil.warn("test warn");
			LogUtil.error("test error");
		}catch(Exception e){
			fail();
		}
	}
	
	@After
	public void tearDown(){
	}
}