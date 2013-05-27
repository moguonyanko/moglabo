package org.mognyan.test.ci;

import static org.junit.Assert.*;

import java.util.Map;

import org.junit.Test;
import org.mognyan.ci.DocumentFiltering;

public class TestDocumentFiltering {

	@Test
	public void test_getWords() {
		String sample = "the quick brown fox jumps over the lazy dog";
		DocumentFiltering docFilter = new DocumentFiltering();
		Map<String, Integer> result = docFilter.get(sample);
		assertTrue(result.get("the") == 2);
	}

}
