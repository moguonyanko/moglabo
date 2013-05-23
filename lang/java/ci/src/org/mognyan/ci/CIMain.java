package org.mognyan.ci;

import java.util.*;

public class CIMain {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		String sample = "the quick brown fox jumps over the lazy dog";
		Map<String, Integer> result = DocumentFiltering.getWords(sample);

		Iterator<String> resultIter = result.keySet().iterator();
		while(resultIter.hasNext()){
			String word = resultIter.next();
			System.out.println("WORD:" + word + " COUNT:" + result.get(word));
		}
	}

}
