package test.org.geese.ci.classifier;

import java.util.*;

import static org.junit.Assert.*;
import org.junit.BeforeClass;
import org.junit.Test;

import org.geese.ci.classifier.DocumentFiltering;
import org.geese.ci.classifier.FisherClassifier;
import org.geese.ci.classifier.NaiveBays;
import org.geese.ci.classifier.TrainException;
import org.geese.ci.classifier.TransactionClassifier;
import org.geese.ci.classifier.filter.WordFilterTask;
import org.geese.ci.classifier.util.StringUtil;
import org.geese.ci.classifier.util.TrainUtil;

public class TestDocumentFiltering{

	@BeforeClass
	public static void beforeSetUp(){
	}

	@Test
	public void test_getWords(){
		String sample = "the quick brown fox jumps over the lazy dog";
		DocumentFiltering docFilter = new DocumentFiltering();
		Map<String, Integer> result = docFilter.get(sample);
		assertTrue(result.get("the") == 2);
	}

	@Test
	public void test_NaiveBaysClassify(){
		WordFilterTask task = new DocumentFiltering();
		NaiveBays nb = new NaiveBays(task);
		boolean isFail = false;
		try{
			nb.start();

			TrainUtil.train(nb);

			String result0 = nb.classify("quick rabbit");
			String result1 = nb.classify("quick money");

			nb.setThresholds("bad", 3.0);

			String result2 = nb.classify("quick money");

			for(int i = 0; i < 10; i++){
				TrainUtil.train(nb);
			}

			String result3 = nb.classify("quick money");

			//assertEquals("good", result0);
			//assertEquals("bad", result1);
			//assertEquals("unknown", result2);
			//assertEquals("bad", result3);
		}catch(TrainException te){
			isFail = true;
		}finally{
			nb.end(isFail);
			assertFalse(isFail);
		}
	}

	@Test
	public void test_OnlyClassifierOperation(){
		WordFilterTask task = new DocumentFiltering();
		TransactionClassifier classifier = new NaiveBays(task);
		
		classifier.start();
		String result = classifier.classify("quick rabbit");
		classifier.end(false);
		
		assertFalse(StringUtil.isNullOrEmpty(result));
	}

	@Test
	public void test_FisherClassify(){
		WordFilterTask task = new DocumentFiltering();
		TransactionClassifier fc = new FisherClassifier(task);
		boolean isFail = false;

		try{
			fc.start();

			TrainUtil.train(fc);

			String result0 = fc.classify("quick rabbit");
			String result1 = fc.classify("quick money");

			fc.setThresholds("bad", 0.8);

			String result2 = fc.classify("quick money");

			fc.setThresholds("good", 0.4);

			String result3 = fc.classify("quick money");

			//assertEquals("good", result0);
			//assertEquals("bad", result1);
			//assertEquals("good", result2);
			//assertEquals("good", result3);
		}catch(TrainException te){
			isFail = true;
		}finally{
			fc.end(isFail);
			assertFalse(isFail);
		}
	}
}
