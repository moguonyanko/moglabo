package org.mognyan.test.ci;

import static org.junit.Assert.*;

import java.util.Map;

import org.junit.Test;
import org.mognyan.ci.DocumentFiltering;
import org.mognyan.ci.NaiveBays;
import org.mognyan.ci.filter.WordFilterTask;
import org.mognyan.ci.util.TrainUtil;

public class TestDocumentFiltering {

	@Test
	public void test_getWords() {
		String sample = "the quick brown fox jumps over the lazy dog";
		DocumentFiltering docFilter = new DocumentFiltering();
		Map<String, Integer> result = docFilter.get(sample);
		assertTrue(result.get("the") == 2);
	}

	@Test
	public void test_NaiveBaysClassify() {
		WordFilterTask task = new DocumentFiltering();
		NaiveBays nb = new NaiveBays(task);

		TrainUtil.sampleTrain(nb);
		String defclass = "unknown";

		String result0 = nb.classify("quick rabbit", defclass);
		String result1 = nb.classify("quick money", defclass);

		nb.setThresholds("bad", 3.0);

		String result2 = nb.classify("quick money", defclass);

		for (int i = 0; i < 10; i++) {
			TrainUtil.sampleTrain(nb);
		}

		String result3 = nb.classify("quick money", defclass);

		assertEquals("good", result0);
		assertEquals("bad", result1);
		assertEquals("unknown", result2);
		assertEquals("bad", result3);
	}
}
